import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { vi, describe, it, expect, beforeEach, onTestFinished } from 'vitest';
import { isJSDOM } from 'test/utils/skipIf';
import { clearWarningsCache } from '@mui/x-internals/warning';
import { ChartsWrapper } from '@mui/x-charts/ChartsWrapper';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { BarPlot } from '@mui/x-charts/BarChart';
import { BarChartPremium } from '../BarChartPremium';
import { BAR_CHART_PREMIUM_PLUGINS } from '../BarChartPremium/BarChartPremium.plugins';
import type { BarChartPremiumPluginSignatures } from '../BarChartPremium/BarChartPremium.plugins';
import { ChartsDataProviderPremium } from '../ChartsDataProviderPremium';
import { ChartsToolbarPremium } from './ChartsToolbarPremium';
import type { ChartsToolbarPremiumProps } from './ChartsToolbarPremium';
import { ChartsToolbarExcelExportTrigger } from './ChartsToolbarExcelExportTrigger';
import { useChartPremiumExport } from '../internals/plugins/useChartPremiumExport';
import type { UseChartPremiumExportSignature } from '../internals/plugins/useChartPremiumExport';

const PLUGINS = [...BAR_CHART_PREMIUM_PLUGINS, useChartPremiumExport] as const;

type Signatures = [...BarChartPremiumPluginSignatures, UseChartPremiumExportSignature];

// Opening the export menu hovers a tooltip-wrapped button, and in a real browser the tooltip
// clones the trigger, so queries by accessible name match twice and its state update lands
// outside `act`. These tests cover the menu's composition, not its layout, so JSDOM is enough.
describe.skipIf(!isJSDOM)('<ChartsToolbarPremium />', () => {
  const { render } = createRenderer();

  let downloads: string[];

  beforeEach(() => {
    downloads = [];
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(function recordDownload(this: HTMLAnchorElement) {
        downloads.push(this.download);
      });
    // JSDOM does not implement object URLs.
    const createObjectURL = URL.createObjectURL;
    const revokeObjectURL = URL.revokeObjectURL;
    URL.createObjectURL = () => 'blob:chart-export';
    URL.revokeObjectURL = () => {};
    onTestFinished(() => {
      click.mockRestore();
      URL.createObjectURL = createObjectURL;
      URL.revokeObjectURL = revokeObjectURL;
    });
  });

  const chart = (toolbarProps: Partial<ChartsToolbarPremiumProps> = {}) => (
    <ChartsDataProviderPremium<'bar', Signatures>
      plugins={PLUGINS}
      width={300}
      height={200}
      series={[{ type: 'bar', id: 'sales', label: 'Sales', data: [1, 2] }]}
      xAxis={[{ data: ['A', 'B'], scaleType: 'band' }]}
    >
      <ChartsWrapper>
        <ChartsToolbarPremium {...toolbarProps} />
        <ChartsSurface>
          <BarPlot />
        </ChartsSurface>
      </ChartsWrapper>
    </ChartsDataProviderPremium>
  );

  it('offers the Excel entry when the chart opts into the plugin', async () => {
    const { user } = render(chart());

    await user.click(screen.getByRole('button', { name: 'Export' }));

    expect(screen.getByRole('menuitem', { name: 'Export data as Excel' })).not.to.equal(null);
    expect(screen.getByRole('menuitem', { name: 'Print' })).not.to.equal(null);
  });

  it('downloads an .xlsx when the entry is clicked', async () => {
    const { user } = render(chart({ excelExportOptions: { fileName: 'sales' } }));

    await user.click(screen.getByRole('button', { name: 'Export' }));
    await user.click(screen.getByRole('menuitem', { name: 'Export data as Excel' }));

    await vi.waitFor(() => expect(downloads).to.deep.equal(['sales.xlsx']));
  });

  it('hides the entry when disableToolbarButton is set', async () => {
    const { user } = render(chart({ excelExportOptions: { disableToolbarButton: true } }));

    await user.click(screen.getByRole('button', { name: 'Export' }));

    expect(screen.queryByRole('menuitem', { name: 'Export data as Excel' })).to.equal(null);
  });

  it('hides the entry when the chart does not opt into the plugin', async () => {
    const { user } = render(
      <BarChartPremium
        width={300}
        height={200}
        series={[{ label: 'Sales', data: [1, 2] }]}
        xAxis={[{ data: ['A', 'B'] }]}
        showToolbar
        slots={{ toolbar: ChartsToolbarPremium }}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Export' }));

    expect(screen.queryByRole('menuitem', { name: 'Export data as Excel' })).to.equal(null);
    expect(screen.getByRole('menuitem', { name: 'Print' })).not.to.equal(null);
  });

  it('renders no export menu at all when nothing is left to put in it', async () => {
    render(
      <BarChartPremium
        width={300}
        height={200}
        series={[{ label: 'Sales', data: [1, 2] }]}
        xAxis={[{ data: ['A', 'B'] }]}
        showToolbar
        slots={{ toolbar: ChartsToolbarPremium }}
        slotProps={{
          toolbar: { printOptions: { disableToolbarButton: true }, imageExportOptions: [] },
        }}
      />,
    );

    expect(screen.queryByRole('button', { name: 'Export' })).to.equal(null);
  });

  it('keeps the menu items the caller passes', async () => {
    const { user } = render(
      chart({
        exportMenuItems: () => <li role="menuitem">Download as PDF</li>,
      }),
    );

    await user.click(screen.getByRole('button', { name: 'Export' }));

    expect(screen.getByRole('menuitem', { name: 'Download as PDF' })).not.to.equal(null);
    expect(screen.getByRole('menuitem', { name: 'Export data as Excel' })).not.to.equal(null);
  });

  it('exports through onExport when the chart has no plugin', async () => {
    const onExport = vi.fn(async () => {});
    const { user } = render(
      <BarChartPremium
        width={300}
        height={200}
        series={[{ label: 'Sales', data: [1, 2] }]}
        xAxis={[{ data: ['A', 'B'] }]}
        showToolbar
        slots={{ toolbar: ChartsToolbarPremium }}
        slotProps={{
          toolbar: {
            exportMenuItems: ({ onClose }) => (
              <ChartsToolbarExcelExportTrigger
                render={<li role="menuitem" />}
                onExport={onExport}
                onClick={onClose}
              >
                Export data as Excel
              </ChartsToolbarExcelExportTrigger>
            ),
          },
        }}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Export' }));
    await user.click(screen.getByRole('menuitem', { name: 'Export data as Excel' }));

    expect(onExport.mock.calls).to.have.length(1);
  });

  describe('Data Grid data entry', () => {
    it('offers the chart export and the Data Grid export as separate entries', async () => {
      const onDataGridExcelExport = vi.fn(async () => {});
      const { user } = render(chart({ onDataGridExcelExport }));

      await user.click(screen.getByRole('button', { name: 'Export' }));

      expect(screen.getByRole('menuitem', { name: 'Export chart data as Excel' })).not.to.equal(
        null,
      );
      expect(screen.getByRole('menuitem', { name: 'Export grid data as Excel' })).not.to.equal(
        null,
      );
    });

    it('calls the Data Grid export, not the chart one, when its entry is clicked', async () => {
      const onDataGridExcelExport = vi.fn(async () => {});
      const { user } = render(chart({ onDataGridExcelExport }));

      await user.click(screen.getByRole('button', { name: 'Export' }));
      await user.click(screen.getByRole('menuitem', { name: 'Export grid data as Excel' }));

      await vi.waitFor(() => expect(onDataGridExcelExport.mock.calls).to.have.length(1));
      // The chart's own export is async, so give it the chance to land before ruling it out.
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });
      expect(downloads).to.deep.equal([]);
    });

    it('is absent when the chart is not bound to a Data Grid', async () => {
      const { user } = render(chart());

      await user.click(screen.getByRole('button', { name: 'Export' }));

      expect(screen.queryByRole('menuitem', { name: 'Export grid data as Excel' })).to.equal(null);
    });

    it('each entry can be disabled on its own', async () => {
      const onDataGridExcelExport = vi.fn(async () => {});
      const { user } = render(
        chart({ onDataGridExcelExport, excelExportOptions: { disableToolbarButton: true } }),
      );

      await user.click(screen.getByRole('button', { name: 'Export' }));

      expect(screen.queryByRole('menuitem', { name: 'Export chart data as Excel' })).to.equal(null);
      expect(screen.getByRole('menuitem', { name: 'Export grid data as Excel' })).not.to.equal(
        null,
      );
    });

    it('hides the Data Grid entry through dataGridExportOptions', async () => {
      const onDataGridExcelExport = vi.fn(async () => {});
      const { user } = render(
        chart({ onDataGridExcelExport, dataGridExportOptions: { disableToolbarButton: true } }),
      );

      await user.click(screen.getByRole('button', { name: 'Export' }));

      // Alone again, so the entry drops the qualifier.
      expect(screen.getByRole('menuitem', { name: 'Export data as Excel' })).not.to.equal(null);
      expect(screen.queryByRole('menuitem', { name: 'Export grid data as Excel' })).to.equal(null);
    });
  });

  it('reports a trigger that has nothing to export, through console.error', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    onTestFinished(() => {
      consoleError.mockRestore();
      consoleWarn.mockRestore();
      clearWarningsCache();
    });
    clearWarningsCache();

    const { user } = render(
      <BarChartPremium
        width={300}
        height={200}
        series={[{ label: 'Sales', data: [1, 2] }]}
        xAxis={[{ data: ['A', 'B'] }]}
        showToolbar
        slots={{ toolbar: ChartsToolbarPremium }}
        slotProps={{
          toolbar: {
            exportMenuItems: ({ onClose }) => (
              <ChartsToolbarExcelExportTrigger render={<li role="menuitem" />} onClick={onClose}>
                Export data as Excel
              </ChartsToolbarExcelExportTrigger>
            ),
          },
        }}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Export' }));
    await user.click(screen.getByRole('menuitem', { name: 'Export data as Excel' }));

    const logged = consoleError.mock.calls.map((call) => call.join(' ')).join('\n');
    expect(logged).to.contain('The Excel export trigger has nothing to export.');
    // The message must not leak the severity as text, which `warnOnce(message, 'error')` did.
    expect(logged).not.to.contain('list. error');
    expect(consoleWarn.mock.calls).to.have.length(0);
  });

  it('logs a rejected export instead of leaving the promise unhandled', async () => {
    const error = new Error('writeBuffer failed');
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    onTestFinished(() => consoleError.mockRestore());

    const { user } = render(
      chart({
        exportMenuItems: ({ onClose }: { onClose: () => void }) => (
          <ChartsToolbarExcelExportTrigger
            render={<li role="menuitem" />}
            onExport={() => Promise.reject(error)}
            onClick={onClose}
          >
            Failing export
          </ChartsToolbarExcelExportTrigger>
        ),
      }),
    );

    await user.click(screen.getByRole('button', { name: 'Export' }));
    await user.click(screen.getByRole('menuitem', { name: 'Failing export' }));

    await vi.waitFor(() =>
      expect(
        consoleError.mock.calls.some(
          (call) => call[0] === 'MUI X Charts: Error exporting chart as Excel:',
        ),
      ).to.equal(true),
    );
  });
});
