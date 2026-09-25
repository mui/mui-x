import * as React from 'react';
import { act, createRenderer } from '@mui/internal-test-utils';
import { vi, describe, it, expect, beforeEach, onTestFinished } from 'vitest';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import type { ChartProApi } from '@mui/x-charts-pro/context';
import { isJSDOM } from 'test/utils/skipIf';

describe.skipIf(isJSDOM)('exportImage', () => {
  const { render } = createRenderer();

  beforeEach(() => {
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    onTestFinished(() => click.mockRestore());
  });

  function Chart({
    apiRef,
    height,
  }: {
    apiRef: React.RefObject<ChartProApi<'bar'> | undefined>;
    height?: number;
  }) {
    return (
      <div style={{ width: 400, height: 300 }}>
        <BarChartPro
          apiRef={apiRef}
          series={[{ data: [10, 20, 30] }]}
          xAxis={[{ scaleType: 'band', data: ['A', 'B', 'C'] }]}
          height={height}
        />
      </div>
    );
  }

  async function exportAndMeasureBody(height?: number) {
    const apiRef: React.RefObject<ChartProApi<'bar'> | undefined> = { current: undefined };
    let exportedSize: DOMRect | undefined;

    render(<Chart apiRef={apiRef} height={height} />);

    await act(async () => {
      await apiRef.current!.exportAsImage({
        onBeforeExport: (iframe) => {
          exportedSize = iframe.contentDocument!.body.getBoundingClientRect();
        },
      });
    });

    return exportedSize;
  }

  it('exports a chart sized by its parent element', async () => {
    const exportedSize = await exportAndMeasureBody();

    expect(exportedSize?.width).to.equal(400);
    expect(exportedSize?.height).to.equal(300);
  });

  it('exports a chart sized by the `height` prop', async () => {
    const exportedSize = await exportAndMeasureBody(200);

    expect(exportedSize?.width).to.equal(400);
    expect(exportedSize?.height).to.equal(200);
  });

  it('exports a chart sized by its parent element when the page styles `body`', async () => {
    const style = document.createElement('style');
    style.textContent = 'body { height: 100%; }';
    document.head.appendChild(style);
    onTestFinished(() => style.remove());

    const exportedSize = await exportAndMeasureBody();

    expect(exportedSize?.width).to.equal(400);
    expect(exportedSize?.height).to.equal(300);
  });

  it('sets the provided nonce on the copied styles', async () => {
    const apiRef: React.RefObject<ChartProApi<'bar'> | undefined> = { current: undefined };
    let exportedNonces: (string | null)[] = [];

    render(<Chart apiRef={apiRef} />);

    await act(async () => {
      await apiRef.current!.exportAsImage({
        nonce: 'export-nonce',
        onBeforeExport: (iframe) => {
          exportedNonces = Array.from(iframe.contentDocument!.head.querySelectorAll('style')).map(
            (element) => element.nonce || element.getAttribute('nonce'),
          );
        },
      });
    });

    expect(exportedNonces.length).to.be.greaterThan(0);
    expect(exportedNonces.every((nonce) => nonce === 'export-nonce')).to.equal(true);
  });

  async function exportAndCatch(apiRef: React.RefObject<ChartProApi<'bar'> | undefined>) {
    let error: Error | undefined;

    await act(async () => {
      await apiRef
        .current!.exportAsImage({
          onBeforeExport: () => {
            throw new Error('Export interrupted');
          },
        })
        .catch((exportError) => {
          error = exportError;
        });
    });

    return error;
  }

  it('rejects when the export fails', async () => {
    const apiRef: React.RefObject<ChartProApi<'bar'> | undefined> = { current: undefined };

    render(<Chart apiRef={apiRef} />);

    const error = await exportAndCatch(apiRef);

    expect(error?.message).to.equal('Export interrupted');
  });

  it('removes the export iframe when the export fails', async () => {
    const apiRef: React.RefObject<ChartProApi<'bar'> | undefined> = { current: undefined };

    render(<Chart apiRef={apiRef} />);

    const iframeCount = document.querySelectorAll('iframe').length;

    await exportAndCatch(apiRef);

    expect(document.querySelectorAll('iframe').length).to.equal(iframeCount);
  });

  it('rejects and removes the iframe when `onStylesheetError` throws', async () => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/missing-stylesheet.css';
    document.head.appendChild(link);
    onTestFinished(() => link.remove());

    const apiRef: React.RefObject<ChartProApi<'bar'> | undefined> = { current: undefined };
    const onBeforeExport = vi.fn();
    const error = new Error('Stop the export');

    render(<Chart apiRef={apiRef} />);

    const iframeCount = document.querySelectorAll('iframe').length;

    await act(async () => {
      await expect(
        apiRef.current!.exportAsImage({
          onBeforeExport,
          onStylesheetError: () => {
            throw error;
          },
        }),
      ).rejects.toBe(error);
    });

    expect(onBeforeExport.mock.calls.length).to.equal(0);
    expect(document.querySelectorAll('iframe').length).to.equal(iframeCount);
  });

  it('continues the export when `onStylesheetError` returns', async () => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/missing-stylesheet.css';
    document.head.appendChild(link);
    onTestFinished(() => link.remove());

    const apiRef: React.RefObject<ChartProApi<'bar'> | undefined> = { current: undefined };
    const onStylesheetError = vi.fn();
    const onBeforeExport = vi.fn();

    render(<Chart apiRef={apiRef} />);

    await act(async () => {
      await apiRef.current!.exportAsImage({ onStylesheetError, onBeforeExport });
    });

    expect(onStylesheetError.mock.calls.length).to.equal(1);
    expect(onBeforeExport.mock.calls.length).to.equal(1);
  });

  it('cancels the export without an error when `onStylesheetError` returns `false`', async () => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/missing-stylesheet.css';
    document.head.appendChild(link);
    onTestFinished(() => link.remove());

    const apiRef: React.RefObject<ChartProApi<'bar'> | undefined> = { current: undefined };
    const onBeforeExport = vi.fn();

    render(<Chart apiRef={apiRef} />);

    const iframeCount = document.querySelectorAll('iframe').length;

    await act(async () => {
      await apiRef.current!.exportAsImage({
        onBeforeExport,
        onStylesheetError: () => Promise.resolve(false),
      });
    });

    expect(onBeforeExport.mock.calls.length).to.equal(0);
    expect(vi.mocked(HTMLAnchorElement.prototype.click).mock.calls.length).to.equal(0);
    expect(document.querySelectorAll('iframe').length).to.equal(iframeCount);
  });
});
