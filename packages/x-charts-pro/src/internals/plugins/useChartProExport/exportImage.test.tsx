import * as React from 'react';
import { act, createRenderer } from '@mui/internal-test-utils';
import { vi } from 'vitest';
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
});
