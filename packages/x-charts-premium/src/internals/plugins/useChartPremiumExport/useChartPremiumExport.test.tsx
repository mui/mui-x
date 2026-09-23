import * as React from 'react';
import { act, createRenderer } from '@mui/internal-test-utils';
import { vi, describe, it, expect, beforeEach, onTestFinished } from 'vitest';
import { BarChartPremium } from '../../../BarChartPremium';
import { ScatterChartPremium } from '../../../ScatterChartPremium';
import { HeatmapPremium } from '../../../HeatmapPremium';
import { CandlestickChart } from '../../../CandlestickChart';
import { ChartsContainerPremium } from '../../../ChartsContainerPremium';
import type { ChartPremiumApi } from '../../../context';

type ApiRef<T extends Parameters<typeof createApiRef>[0]> = React.RefObject<
  ChartPremiumApi<T> | undefined
>;

function createApiRef<T extends 'bar' | 'scatter' | 'heatmap' | 'ohlc' | 'composition'>(
  _type: T,
): ApiRef<T> {
  return { current: undefined };
}

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

  describe('getDataAsExcel', () => {
    it('merges bar and line series into one sheet', async () => {
      const apiRef = createApiRef('bar');
      render(
        <ChartsContainerPremium
          apiRef={apiRef as ApiRef<'composition'>}
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

    it('is exposed on BarChartPremium', async () => {
      const apiRef = createApiRef('bar');
      render(
        <BarChartPremium
          apiRef={apiRef}
          width={300}
          height={200}
          series={[{ label: 'Sales', data: [1, 2] }]}
          xAxis={[{ data: ['A', 'B'] }]}
        />,
      );

      const workbook = await act(() => apiRef.current!.getDataAsExcel());

      expect(workbook!.worksheets[0].getCell('C3').value).to.equal(2);
    });

    it('writes one sheet per column signature in a composition', async () => {
      const apiRef = createApiRef('composition');
      render(
        <ChartsContainerPremium
          apiRef={apiRef}
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

    it('is exposed on ScatterChartPremium', async () => {
      const apiRef = createApiRef('scatter');
      render(
        <ScatterChartPremium
          apiRef={apiRef}
          width={300}
          height={200}
          series={[{ label: 'Points', data: [{ x: 1, y: 2 }] }]}
        />,
      );

      const workbook = await act(() => apiRef.current!.getDataAsExcel());

      expect(workbook!.worksheets[0].name).to.equal('scatter');
    });

    it('is exposed on HeatmapPremium, which overrides the Pro plugin list', async () => {
      const apiRef = createApiRef('heatmap');
      render(
        <HeatmapPremium
          apiRef={apiRef}
          width={300}
          height={200}
          series={[{ data: [[0, 0, 4]] }]}
          xAxis={[{ data: ['Jan'] }]}
          yAxis={[{ data: ['Mon'] }]}
        />,
      );

      const workbook = await act(() => apiRef.current!.getDataAsExcel());

      expect(workbook!.worksheets[0].name).to.equal('heatmap');
    });

    it('is exposed on CandlestickChart', async () => {
      const apiRef = createApiRef('ohlc');
      render(
        <CandlestickChart
          apiRef={apiRef}
          width={300}
          height={200}
          series={[{ data: [[1, 2, 0, 1]] }]}
          xAxis={[{ data: ['A'] }]}
        />,
      );

      const workbook = await act(() => apiRef.current!.getDataAsExcel());

      expect(workbook!.worksheets[0].name).to.equal('ohlc');
    });

    it('passes options through to the extractors', async () => {
      const apiRef = createApiRef('bar');
      render(
        <BarChartPremium
          apiRef={apiRef}
          width={300}
          height={200}
          series={[
            { id: 'visible', label: 'Visible', data: [1] },
            { id: 'hidden', label: 'Hidden', data: [2] },
          ]}
          xAxis={[{ data: ['A'] }]}
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
      const apiRef = createApiRef('bar');
      render(<BarChartPremium apiRef={apiRef} width={300} height={200} series={[]} />);

      const workbook = await act(() => apiRef.current!.getDataAsExcel());

      expect(workbook).to.equal(null);
    });
  });

  describe('exportAsExcel', () => {
    it('downloads an .xlsx named after the fileName option', async () => {
      const apiRef = createApiRef('bar');
      render(
        <BarChartPremium
          apiRef={apiRef}
          width={300}
          height={200}
          series={[{ data: [1] }]}
          xAxis={[{ data: ['A'] }]}
        />,
      );

      await act(() => apiRef.current!.exportAsExcel({ fileName: 'sales' }));

      expect(downloads).to.deep.equal(['sales.xlsx']);
    });

    it('falls back to the document title', async () => {
      const title = document.title;
      document.title = 'Report';
      onTestFinished(() => {
        document.title = title;
      });
      const apiRef = createApiRef('bar');
      render(
        <BarChartPremium
          apiRef={apiRef}
          width={300}
          height={200}
          series={[{ data: [1] }]}
          xAxis={[{ data: ['A'] }]}
        />,
      );

      await act(() => apiRef.current!.exportAsExcel());

      expect(downloads).to.deep.equal(['Report.xlsx']);
    });

    it('falls back to `untitled` when the document has no title', async () => {
      const title = document.title;
      document.title = '';
      onTestFinished(() => {
        document.title = title;
      });
      const apiRef = createApiRef('bar');
      render(
        <BarChartPremium
          apiRef={apiRef}
          width={300}
          height={200}
          series={[{ data: [1] }]}
          xAxis={[{ data: ['A'] }]}
        />,
      );

      await act(() => apiRef.current!.exportAsExcel());
      await act(() => apiRef.current!.exportAsExcel({ fileName: '' }));

      expect(downloads).to.deep.equal(['untitled.xlsx', 'untitled.xlsx']);
    });

    it('does not download when the chart has no data', async () => {
      const apiRef = createApiRef('bar');
      render(<BarChartPremium apiRef={apiRef} width={300} height={200} series={[]} />);

      await act(() => apiRef.current!.exportAsExcel());

      expect(downloads).to.deep.equal([]);
    });
  });
});
