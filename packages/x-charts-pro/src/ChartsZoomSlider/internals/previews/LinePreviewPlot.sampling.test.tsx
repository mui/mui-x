import * as React from 'react';
import { createRenderer } from '@mui/internal-test-utils';
import { lineClasses } from '@mui/x-charts/LineChart';
import { LineChartPro } from '../../../LineChartPro';

// The preview path has no `lineClasses.line` class; the main line path does.
const previewPointCount = (container: HTMLElement) => {
  const paths = Array.from(container.querySelectorAll<SVGPathElement>('path[data-series]'));
  const preview = paths.find((p) => !p.classList.contains(lineClasses.line));
  return ((preview?.getAttribute('d') ?? '').match(/[MLC]/g) ?? []).length;
};

describe('<LineChartPro /> - zoom slider preview sampling', () => {
  const { render } = createRenderer();
  const range = (n: number) => Array.from({ length: n }, (_, i) => i);

  const renderAt = (start: number, end: number) =>
    render(
      <LineChartPro
        series={[{ data: range(1024), showMark: false }]}
        xAxis={[{ data: range(1024), id: 'x', zoom: { slider: { enabled: true, preview: true } } }]}
        yAxis={[{ position: 'none' }]}
        width={400}
        height={200}
        margin={0}
        sampling="lttb"
        skipAnimation
        zoomData={[{ axisId: 'x', start, end }]}
      />,
    );

  it('keeps the preview density constant regardless of the active zoom', () => {
    const { container: full } = renderAt(0, 100);
    const { container: zoomed } = renderAt(90, 100);
    expect(previewPointCount(zoomed)).to.equal(previewPointCount(full));
  });
});
