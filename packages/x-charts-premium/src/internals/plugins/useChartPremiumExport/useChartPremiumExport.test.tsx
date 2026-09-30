import * as React from 'react';
import { act, createRenderer } from '@mui/internal-test-utils';
import { vi, describe, it, expect, beforeEach, onTestFinished } from 'vitest';
import type { ChartSeriesType } from '@mui/x-charts/internals';
import { BarChartPremium } from '../../../BarChartPremium';
import { BAR_CHART_PREMIUM_PLUGINS } from '../../../BarChartPremium/BarChartPremium.plugins';
import type { BarChartPremiumPluginSignatures } from '../../../BarChartPremium/BarChartPremium.plugins';
import { ChartsContainerPremium } from '../../../ChartsContainerPremium';
import type { ChartPremiumApi } from '../../../context';
import { useChartPremiumExport } from './useChartPremiumExport';
import type { UseChartPremiumExportSignature } from './useChartPremiumExport.types';

// The plugin is opt-in, so both the list and the api type name it explicitly.
const PLUGINS = [...BAR_CHART_PREMIUM_PLUGINS, useChartPremiumExport] as const;

type Signatures = [...BarChartPremiumPluginSignatures, UseChartPremiumExportSignature];

type ExportApi = ChartPremiumApi<undefined, Signatures>;

const createApiRef = (): React.RefObject<ExportApi | undefined> => ({ current: undefined });

describe('useChartPremiumExport', () => {
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

  describe('registration', () => {
    it('is absent from a composition that does not opt in', async () => {
      const apiRef = createApiRef();
      render(
        <ChartsContainerPremium
          apiRef={apiRef as any}
          width={300}
          height={200}
          series={[{ type: 'bar', id: 'sales', data: [1, 2] }]}
          xAxis={[{ data: ['A', 'B'], scaleType: 'band' }]}
        />,
      );

      expect((apiRef.current as any).getDataAsExcel).to.equal(undefined);
      expect((apiRef.current as any).exportAsExcel).to.equal(undefined);
    });

    it('is absent from the single-component charts, which take no plugin list', async () => {
      const apiRef = createApiRef();
      render(
        <BarChartPremium
          apiRef={apiRef as any}
          width={300}
          height={200}
          series={[{ label: 'Sales', data: [1, 2] }]}
          xAxis={[{ data: ['A', 'B'] }]}
        />,
      );

      expect((apiRef.current as any).getDataAsExcel).to.equal(undefined);
      expect((apiRef.current as any).exportAsExcel).to.equal(undefined);
    });
  });

  describe('getDataAsExcel', () => {
    it('merges bar and line series into one sheet', async () => {
      const apiRef = createApiRef();
      render(
        <ChartsContainerPremium<ChartSeriesType, Signatures>
          apiRef={apiRef}
          plugins={PLUGINS}
          width={300}
          height={200}
          series={[
            { type: 'bar', id: 'sales', label: 'Sales', data: [1, 2] },
            { type: 'line', id: 'trend', label: 'Trend', data: [3, 4] },
          ]}
          xAxis={[{ data: ['A', 'B'] }]}
        />,
      );

      const workbook = await act(() => apiRef.current!.getDataAsExcel());
      const worksheet = workbook!.worksheets[0];

      expect(workbook!.worksheets.map((sheet) => sheet.name)).to.deep.equal(['category']);
      expect(worksheet.getCell('A2').value).to.equal('Sales');
      expect(worksheet.getCell('B2').value).to.equal('A');
      expect(worksheet.getCell('A4').value).to.equal('Trend');
      expect(worksheet.getCell('C5').value).to.equal(4);
    });

    it('writes one sheet per column signature in a composition', async () => {
      const apiRef = createApiRef();
      render(
        <ChartsContainerPremium<ChartSeriesType, Signatures>
          apiRef={apiRef}
          plugins={PLUGINS}
          width={300}
          height={200}
          series={[
            { type: 'bar', id: 'sales', data: [1, 2] },
            { type: 'scatter', id: 'points', data: [{ x: 1, y: 2 }] },
          ]}
          xAxis={[{ data: ['A', 'B'], scaleType: 'band' }]}
        />,
      );

      const workbook = await act(() => apiRef.current!.getDataAsExcel());

      expect(workbook!.worksheets.map((sheet) => sheet.name)).to.deep.equal([
        'category',
        'scatter',
      ]);
    });

    it('passes options through to the extractors', async () => {
      const apiRef = createApiRef();
      render(
        <ChartsContainerPremium<ChartSeriesType, Signatures>
          apiRef={apiRef}
          plugins={PLUGINS}
          width={300}
          height={200}
          series={[
            { type: 'bar', id: 'visible', label: 'Visible', data: [1] },
            { type: 'bar', id: 'hidden', label: 'Hidden', data: [2] },
          ]}
          xAxis={[{ data: ['A'], scaleType: 'band' }]}
          hiddenItems={[{ type: 'bar', seriesId: 'hidden' }]}
        />,
      );

      const all = await act(() => apiRef.current!.getDataAsExcel());
      const visibleOnly = await act(() =>
        apiRef.current!.getDataAsExcel({ includeHiddenSeries: false }),
      );

      expect(all!.worksheets[0].rowCount).to.equal(3);
      expect(visibleOnly!.worksheets[0].rowCount).to.equal(2);
    });

    it('resolves to null when the chart has no data', async () => {
      const apiRef = createApiRef();
      render(
        <ChartsContainerPremium<ChartSeriesType, Signatures>
          apiRef={apiRef}
          plugins={PLUGINS}
          width={300}
          height={200}
          series={[]}
        />,
      );

      const workbook = await act(() => apiRef.current!.getDataAsExcel());

      expect(workbook).to.equal(null);
    });
  });

  describe('exportAsExcel', () => {
    const chart = (apiRef: React.RefObject<ExportApi | undefined>) => (
      <ChartsContainerPremium<ChartSeriesType, Signatures>
        apiRef={apiRef}
        plugins={PLUGINS}
        width={300}
        height={200}
        series={[{ type: 'bar', id: 'sales', data: [1] }]}
        xAxis={[{ data: ['A'], scaleType: 'band' }]}
      />
    );

    it('downloads an .xlsx named after the fileName option', async () => {
      const apiRef = createApiRef();
      render(chart(apiRef));

      await act(() => apiRef.current!.exportAsExcel({ fileName: 'sales' }));

      expect(downloads).to.deep.equal(['sales.xlsx']);
    });

    it('falls back to the document title', async () => {
      const title = document.title;
      document.title = 'Report';
      onTestFinished(() => {
        document.title = title;
      });
      const apiRef = createApiRef();
      render(chart(apiRef));

      await act(() => apiRef.current!.exportAsExcel());

      expect(downloads).to.deep.equal(['Report.xlsx']);
    });

    it('falls back to `untitled` when the document has no title', async () => {
      const title = document.title;
      document.title = '';
      onTestFinished(() => {
        document.title = title;
      });
      const apiRef = createApiRef();
      render(chart(apiRef));

      await act(() => apiRef.current!.exportAsExcel());
      await act(() => apiRef.current!.exportAsExcel({ fileName: '' }));

      expect(downloads).to.deep.equal(['untitled.xlsx', 'untitled.xlsx']);
    });

    it('does not download when the chart has no data', async () => {
      const apiRef = createApiRef();
      render(
        <ChartsContainerPremium<ChartSeriesType, Signatures>
          apiRef={apiRef}
          plugins={PLUGINS}
          width={300}
          height={200}
          series={[]}
        />,
      );

      await act(() => apiRef.current!.exportAsExcel());

      expect(downloads).to.deep.equal([]);
    });
  });
});
