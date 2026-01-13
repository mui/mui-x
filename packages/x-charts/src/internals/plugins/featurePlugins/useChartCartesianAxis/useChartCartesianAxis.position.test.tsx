import { createRenderer } from '@mui/internal-test-utils';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { isJSDOM } from 'test/utils/skipIf';

describe('useChartCartesianAxis - positions', () => {
  const { render } = createRenderer();

  it('should not render axes when position is none', async () => {
    render(
      <BarChart
        yAxis={[{ position: 'none' }]}
        xAxis={[{ id: 'qwerty', data: ['a', 'b'], position: 'none' }]}
        series={[{ data: [1, 2] }]}
        margin={0}
        height={100}
        width={100}
      />,
    );

    const axesRoot = await document.querySelectorAll(`.${axisClasses.root}`);
    expect(axesRoot).toHaveLength(0);
  });

  it.skipIf(isJSDOM)('should place axes according to their dimensions', async () => {
    render(
      <BarChart
        xAxis={[{ data: ['a', 'b'], height: 30 }]}
        yAxis={[{ width: 20 }]}
        series={[{ data: [1, 2] }]}
        margin={0}
        height={100}
        width={100}
      />,
    );

    const axesRoot = await document.querySelectorAll(`.${axisClasses.root}`);
    expect(axesRoot).toHaveLength(2);

    // transform format: matrix(a, b, c, d, tx, ty)
    expect(getComputedStyle(axesRoot[0]).transform).toBe('matrix(1, 0, 0, 1, 0, 70)'); // xAxis
    expect(getComputedStyle(axesRoot[1]).transform).toBe('matrix(1, 0, 0, 1, 20, 0)'); // yAxis
  });

  it.skipIf(isJSDOM)('should place axes according to their dimensions and position', async () => {
    render(
      <BarChart
        xAxis={[{ data: ['a', 'b'], height: 30, position: 'top' }]}
        yAxis={[{ width: 20, position: 'right' }]}
        series={[{ data: [1, 2] }]}
        margin={0}
        height={100}
        width={100}
      />,
    );

    const axesRoot = await document.querySelectorAll(`.${axisClasses.root}`);
    expect(axesRoot).toHaveLength(2);

    // transform format: matrix(a, b, c, d, tx, ty)
    expect(getComputedStyle(axesRoot[0]).transform).toBe('matrix(1, 0, 0, 1, 0, 30)'); // xAxis
    expect(getComputedStyle(axesRoot[1]).transform).toBe('matrix(1, 0, 0, 1, 80, 0)'); // yAxis
  });

  it('should not render extra axes if they have no position', async () => {
    render(
      <BarChart
        xAxis={[
          { data: ['a', 'b'], height: 30 },
          { data: ['a', 'b'], height: 30 },
        ]}
        yAxis={[{ width: 20 }, { min: 0, max: 10, width: 20 }]}
        series={[{ data: [1, 2] }]}
        margin={0}
        height={100}
        width={100}
      />,
    );

    const axesRoot = await document.querySelectorAll(`.${axisClasses.root}`);
    expect(axesRoot).toHaveLength(2);
  });

  it.skipIf(isJSDOM)('should stack axes when they are at the same position', async () => {
    render(
      <BarChart
        xAxis={[
          { data: ['a', 'b'], height: 30, position: 'top' },
          { data: ['a', 'b'], height: 30, position: 'top' },
        ]}
        yAxis={[
          { width: 20, position: 'left' },
          { min: 0, max: 10, width: 20, position: 'left' },
        ]}
        series={[{ data: [1, 2] }]}
        margin={0}
        height={100}
        width={100}
      />,
    );

    const axesRoot = await document.querySelectorAll(`.${axisClasses.root}`);
    expect(axesRoot).toHaveLength(4);

    // transform format: matrix(a, b, c, d, tx, ty)
    expect(getComputedStyle(axesRoot[0]).transform).toBe('matrix(1, 0, 0, 1, 0, 60)'); // xAxis
    expect(getComputedStyle(axesRoot[1]).transform).toBe('matrix(1, 0, 0, 1, 0, 30)'); // xAxis
    expect(getComputedStyle(axesRoot[2]).transform).toBe('matrix(1, 0, 0, 1, 40, 0)'); // yAxis
    expect(getComputedStyle(axesRoot[3]).transform).toBe('matrix(1, 0, 0, 1, 20, 0)'); // yAxis
  });

  it.skipIf(isJSDOM)(
    'should apply axesGap on stack axes when they are at the same position',
    async () => {
      render(
        <BarChart
          axesGap={5}
          xAxis={[
            { data: ['a', 'b'], height: 30, position: 'top' },
            { data: ['a', 'b'], height: 30, position: 'top' },
          ]}
          yAxis={[
            { width: 20, position: 'left' },
            { min: 0, max: 10, width: 20, position: 'left' },
          ]}
          series={[{ data: [1, 2] }]}
          margin={0}
          height={100}
          width={100}
        />,
      );

      const axesRoot = await document.querySelectorAll(`.${axisClasses.root}`);
      expect(axesRoot).toHaveLength(4);

      // transform format: matrix(a, b, c, d, tx, ty)
      expect(getComputedStyle(axesRoot[0]).transform).toBe('matrix(1, 0, 0, 1, 0, 65)'); // xAxis with addition 5px gap
      expect(getComputedStyle(axesRoot[1]).transform).toBe('matrix(1, 0, 0, 1, 0, 30)'); // xAxis
      expect(getComputedStyle(axesRoot[2]).transform).toBe('matrix(1, 0, 0, 1, 45, 0)'); // yAxis with addition 5px gap
      expect(getComputedStyle(axesRoot[3]).transform).toBe('matrix(1, 0, 0, 1, 20, 0)'); // yAxis
    },
  );
});
