import * as React from 'react';
import { act, createRenderer } from '@mui/internal-test-utils';
import { vi, describe, it, expect, onTestFinished } from 'vitest';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import type { ChartProApi } from '@mui/x-charts-pro/context';
import { isJSDOM } from 'test/utils/skipIf';
import { setupPrintFont } from 'test/utils/printFont';

describe.skipIf(isJSDOM)('printChart', () => {
  const { render } = createRenderer();

  function Chart({ apiRef }: { apiRef: React.RefObject<ChartProApi<'bar'> | undefined> }) {
    return (
      <div style={{ width: 400, height: 300 }}>
        <BarChartPro
          apiRef={apiRef}
          series={[{ data: [10, 20, 30] }]}
          xAxis={[{ scaleType: 'band', data: ['A', 'B', 'C'] }]}
        />
      </div>
    );
  }

  it('resolves once the print dialog has been shown', async () => {
    const apiRef: React.RefObject<ChartProApi<'bar'> | undefined> = { current: undefined };
    let printed = false;

    render(<Chart apiRef={apiRef} />);

    await act(async () => {
      await apiRef.current!.exportAsPrint({
        onBeforeExport: (iframe) => {
          /* Replace `print` so that the test doesn't open the browser's print dialog. */
          iframe.contentWindow!.print = () => {
            printed = true;
          };
        },
      });
    });

    expect(printed).to.equal(true);
  });

  it.each(['loaded', 'error'] as const)(
    'waits for a delayed font to settle as %s before printing',
    async (fontStatus) => {
      const font = await setupPrintFont();
      const apiRef: React.RefObject<ChartProApi<'bar'> | undefined> = { current: undefined };
      let printWindow: HTMLIFrameElement | undefined;
      const print = vi.fn(() =>
        Array.from(printWindow!.contentDocument!.fonts, (face) => face.status),
      );

      render(<Chart apiRef={apiRef} />);

      let exportPromise!: Promise<void>;
      act(() => {
        exportPromise = apiRef.current!.exportAsPrint({
          copyStyles: false,
          onBeforeExport: (iframe) => {
            printWindow = iframe;
            const style = iframe.contentDocument!.createElement('style');
            style.textContent = font.css;
            iframe.contentDocument!.head.appendChild(style);
            iframe.contentWindow!.print = print;
          },
        });
      });

      try {
        await act(async () => {
          await expect.poll(() => printWindow?.contentDocument?.fonts.status).to.equal('loading');
          expect(print).not.toHaveBeenCalled();

          await font.resolve(fontStatus);
          await exportPromise;
        });

        expect(print).toHaveBeenCalledTimes(1);
        expect(print.mock.results[0].value).to.deep.equal([fontStatus]);
      } finally {
        await act(async () => {
          await font.resolve('error');
          await exportPromise;
        });
        printWindow?.remove();
      }
    },
  );

  it('rejects when the print export fails', async () => {
    const apiRef: React.RefObject<ChartProApi<'bar'> | undefined> = { current: undefined };
    const iframeCount = document.querySelectorAll('iframe').length;
    let error: Error | undefined;

    render(<Chart apiRef={apiRef} />);

    await act(async () => {
      await apiRef
        .current!.exportAsPrint({
          onBeforeExport: () => {
            throw new Error('Print interrupted');
          },
        })
        .catch((printError) => {
          error = printError;
        });
    });

    expect(error?.message).to.equal('Print interrupted');
    expect(document.querySelectorAll('iframe').length).to.equal(iframeCount);
  });

  function addMissingStylesheet() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/missing-stylesheet.css';
    document.head.appendChild(link);
    onTestFinished(() => link.remove());
  }

  it('rejects and removes the iframe when `onStylesheetError` throws', async () => {
    addMissingStylesheet();
    const apiRef: React.RefObject<ChartProApi<'bar'> | undefined> = { current: undefined };
    const onBeforeExport = vi.fn();
    const error = new Error('Stop the print');

    render(<Chart apiRef={apiRef} />);

    const iframeCount = document.querySelectorAll('iframe').length;

    await act(async () => {
      await expect(
        apiRef.current!.exportAsPrint({
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

  it('continues the print when `onStylesheetError` returns', async () => {
    addMissingStylesheet();
    const apiRef: React.RefObject<ChartProApi<'bar'> | undefined> = { current: undefined };
    const onStylesheetError = vi.fn();
    let printed = false;

    render(<Chart apiRef={apiRef} />);

    await act(async () => {
      await apiRef.current!.exportAsPrint({
        onStylesheetError,
        onBeforeExport: (iframe) => {
          iframe.contentWindow!.print = () => {
            printed = true;
          };
        },
      });
    });

    expect(onStylesheetError.mock.calls.length).to.equal(1);
    expect(printed).to.equal(true);
  });

  it('cancels the print without an error when `onStylesheetError` returns `false`', async () => {
    addMissingStylesheet();
    const apiRef: React.RefObject<ChartProApi<'bar'> | undefined> = { current: undefined };
    const onBeforeExport = vi.fn();

    render(<Chart apiRef={apiRef} />);

    const iframeCount = document.querySelectorAll('iframe').length;

    await act(async () => {
      await apiRef.current!.exportAsPrint({
        onBeforeExport,
        onStylesheetError: () => false,
      });
    });

    expect(onBeforeExport.mock.calls.length).to.equal(0);
    expect(document.querySelectorAll('iframe').length).to.equal(iframeCount);
  });
});
