import { createRenderer } from '@mui/internal-test-utils';
import { HeatmapPlot, heatmapClasses } from '@mui/x-charts-pro/Heatmap';
import { describe, it, expect } from 'vitest';
import { Heatmap } from './Heatmap';

describe('<HeatmapPlot />', () => {
  const { render } = createRenderer();

  it('should apply className to root element', () => {
    const { container } = render(
      <Heatmap
        series={[
          {
            data: [
              [0, 0, 10],
              [1, 0, 20],
            ],
          },
        ]}
        xAxis={[{ scaleType: 'band', data: ['A', 'B'] }]}
        yAxis={[{ scaleType: 'band', data: ['X'] }]}
        width={200}
        height={200}
      >
        <HeatmapPlot className="custom-heatmap" />
      </Heatmap>,
    );

    const root = container.querySelector(`.${heatmapClasses.root}.custom-heatmap`);
    expect(root).not.to.equal(null);
  });

  it('should color cells with the series `colorGetter`, based on value and position', () => {
    const { container } = render(
      <Heatmap
        series={[
          {
            data: [
              [0, 0, 10],
              [1, 0, 20],
            ],
            colorGetter: (value, { xIndex, yIndex }) => `rgb(${xIndex}, ${yIndex}, ${value ?? 0})`,
          },
        ]}
        xAxis={[{ scaleType: 'band', data: ['A', 'B'] }]}
        yAxis={[{ scaleType: 'band', data: ['X'] }]}
        width={200}
        height={200}
      />,
    );

    const cells = container.querySelectorAll(`.${heatmapClasses.cell}`);
    expect(cells.length).to.equal(2);
    expect(window.getComputedStyle(cells[0]).fill).to.equal('rgb(0, 0, 10)');
    expect(window.getComputedStyle(cells[1]).fill).to.equal('rgb(1, 0, 20)');
  });

  it('should fall back to the z-axis color scale when no `colorGetter` is set', () => {
    const { container } = render(
      <Heatmap
        series={[
          {
            data: [
              [0, 0, 0],
              [1, 0, 100],
            ],
          },
        ]}
        xAxis={[{ scaleType: 'band', data: ['A', 'B'] }]}
        yAxis={[{ scaleType: 'band', data: ['X'] }]}
        zAxis={[
          { colorMap: { type: 'continuous', min: 0, max: 100, color: ['#000000', '#ff0000'] } },
        ]}
        width={200}
        height={200}
      />,
    );

    const cells = container.querySelectorAll(`.${heatmapClasses.cell}`);
    expect(cells.length).to.equal(2);
    expect(window.getComputedStyle(cells[0]).fill).to.equal('rgb(0, 0, 0)');
    expect(window.getComputedStyle(cells[1]).fill).to.equal('rgb(255, 0, 0)');
  });
});
