import { createRenderer } from '@mui/internal-test-utils';
import { HeatmapPlot, heatmapClasses } from '@mui/x-charts-pro/Heatmap';
import type { HeatmapCellProps } from '@mui/x-charts-pro/Heatmap';
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

  it('should pass `xIndex` and `yIndex` to the cell slot', () => {
    // A Set because the render can run more than once per cell.
    const received = new Set<string>();

    function CustomCell({ xIndex, yIndex, ownerState, ...other }: HeatmapCellProps) {
      received.add(`${xIndex},${yIndex}`);
      return <rect {...other} data-testid="custom-cell" />;
    }

    render(
      <Heatmap
        series={[
          {
            data: [
              [0, 0, 10],
              [1, 0, 20],
              [1, 1, 30],
            ],
          },
        ]}
        xAxis={[{ scaleType: 'band', data: ['A', 'B'] }]}
        yAxis={[{ scaleType: 'band', data: ['X', 'Y'] }]}
        slots={{ cell: CustomCell }}
        width={200}
        height={200}
      />,
    );

    expect([...received].sort()).to.deep.equal(['0,0', '1,0', '1,1']);
  });

  it('should not forward `xIndex` and `yIndex` to the DOM', () => {
    const { container } = render(
      <Heatmap
        series={[{ data: [[0, 0, 10]] }]}
        xAxis={[{ scaleType: 'band', data: ['A'] }]}
        yAxis={[{ scaleType: 'band', data: ['X'] }]}
        width={200}
        height={200}
      />,
    );

    const cell = container.querySelector(`.${heatmapClasses.cell}`)!;
    expect(cell.getAttribute('xIndex')).to.equal(null);
    expect(cell.getAttribute('yIndex')).to.equal(null);
    expect(cell.getAttribute('xindex')).to.equal(null);
    expect(cell.getAttribute('yindex')).to.equal(null);
  });
});
