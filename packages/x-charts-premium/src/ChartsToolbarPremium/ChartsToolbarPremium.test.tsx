import * as React from 'react';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { vi, describe, it, expect, beforeEach, onTestFinished } from 'vitest';
import { ChartsWrapper } from '@mui/x-charts/ChartsWrapper';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { BarPlot } from '@mui/x-charts/BarChart';
import { BarChartPremium } from '../BarChartPremium';
import { ChartsDataProviderPremium } from '../ChartsDataProviderPremium';
import { ChartsToolbarPremium } from './ChartsToolbarPremium';
import { DEFAULT_PLUGINS } from '../internals/plugins/allPlugins';
import { useChartPremiumExport } from '../internals/plugins/useChartPremiumExport';

const PLUGINS = [...DEFAULT_PLUGINS, useChartPremiumExport];

describe('<ChartsToolbarPremium />', () => {
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

  const chart = (toolbarProps = {}) => (
    <ChartsDataProviderPremium
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

    expect(screen.getByRole('menuitem', { name: 'Download as Excel' })).not.to.equal(null);
    expect(screen.getByRole('menuitem', { name: 'Print' })).not.to.equal(null);
  });

  it('downloads an .xlsx when the entry is clicked', async () => {
    const { user } = render(chart({ excelExportOptions: { fileName: 'sales' } }));

    await user.click(screen.getByRole('button', { name: 'Export' }));
    await user.click(screen.getByRole('menuitem', { name: 'Download as Excel' }));

    await vi.waitFor(() => expect(downloads).to.deep.equal(['sales.xlsx']));
  });

  it('hides the entry when disableToolbarButton is set', async () => {
    const { user } = render(chart({ excelExportOptions: { disableToolbarButton: true } }));

    await user.click(screen.getByRole('button', { name: 'Export' }));

    expect(screen.queryByRole('menuitem', { name: 'Download as Excel' })).to.equal(null);
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

    expect(screen.queryByRole('menuitem', { name: 'Download as Excel' })).to.equal(null);
    expect(screen.getByRole('menuitem', { name: 'Print' })).not.to.equal(null);
  });
});
