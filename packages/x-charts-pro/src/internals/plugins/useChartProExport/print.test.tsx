import * as React from 'react';
import { act, createRenderer } from '@mui/internal-test-utils';
import { describe, it, expect } from 'vitest';
import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import type { ChartProApi } from '@mui/x-charts-pro/context';
import { isJSDOM } from 'test/utils/skipIf';

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

  it('resolves once the print dialog is opened', async () => {
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
});
