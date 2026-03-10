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

  it.skipIf(isJSDOM)(
    'should stack auto-size axes using computed sizes instead of defaults',
    async () => {
      // Regression test: when multiple axes use `width: 'auto'` at the same position,
      // the offset of the second axis should be based on the actual auto-computed size
      // of the first, not the default placeholder size.
      render(
        <BarChart
          xAxis={[{ data: ['a', 'b'] }]}
          yAxis={[
            { width: 'auto', position: 'left' },
            { min: 0, max: 100, width: 'auto', position: 'left' },
          ]}
          series={[{ data: [1, 200000000000000] }]}
          margin={0}
          height={300}
          width={300}
        />,
      );

      const axesRoot = await document.querySelectorAll(`.${axisClasses.root}`);
      // 1 x-axis + 2 y-axes
      expect(axesRoot).toHaveLength(3);

      // For left y-axes, transform is translate(drawingArea.left - offset, 0).
      // The first axis (offset=0) has the largest tx, the second axis is further left.
      // transform format: matrix(a, b, c, d, tx, ty)
      const getTx = (transform: string) => {
        const match = transform.match(/matrix\(([^)]+)\)/);
        return match ? Number(match[1].split(',')[4].trim()) : NaN;
      };

      const yAxis1Tx = getTx(getComputedStyle(axesRoot[1]).transform);
      const yAxis2Tx = getTx(getComputedStyle(axesRoot[2]).transform);

      // The first y-axis (offset=0) should be closer to the chart (larger tx).
      // The second y-axis should be further left (smaller tx).
      expect(yAxis1Tx).toBeGreaterThan(yAxis2Tx);

      // The offset difference (yAxis1Tx - yAxis2Tx) equals the auto-computed width
      // of the first axis. For small numbers "0" to "10", this should be less than
      // the default width of 45px, proving the offset uses the actual auto-computed size.
      const firstAxisAutoWidth = yAxis1Tx - yAxis2Tx;
      expect(firstAxisAutoWidth).toBeGreaterThan(0);
      expect(firstAxisAutoWidth).toBeLessThan(45);
    },
  );

  it.skipIf(isJSDOM)('should stack mixed auto-size and fixed-size axes correctly', async () => {
    // Regression test: mixing auto-size and fixed-size axes at the same position
    // should correctly compute offsets for all axes.
    render(
      <BarChart
        xAxis={[{ data: ['a', 'b'] }]}
        yAxis={[
          { min: 0, max: 100, width: 30, position: 'left' },
          { id: 'value', width: 'auto', position: 'left' },
        ]}
        series={[{ data: [1, 2000000000], yAxisId: 'value' }]}
        margin={20}
        height={300}
        width={300}
      />,
    );

    const axesRoot = await document.querySelectorAll(`.${axisClasses.root}`);
    expect(axesRoot).toHaveLength(3);

    const getTx = (transform: string) => {
      const match = transform.match(/matrix\(([^)]+)\)/);
      return match ? Number(match[1].split(',')[4].trim()) : NaN;
    };

    const yAxis1Tx = getTx(getComputedStyle(axesRoot[1]).transform);
    const yAxis2Tx = getTx(getComputedStyle(axesRoot[2]).transform);

    // The offset difference equals the auto-computed width of the first axis.
    // For small numbers "0" to "10", this should be less than the default 45px.
    const firstAxisAutoWidth = yAxis1Tx - yAxis2Tx;
    expect(firstAxisAutoWidth).toBeGreaterThan(0);
    expect(firstAxisAutoWidth).toBeLessThan(45);
  });

  it.skipIf(isJSDOM)('should add extra space for preview', async () => {
    render(
      <BarChart
        axesGap={5}
        xAxis={[
          { data: ['a', 'b'], height: 30, position: 'top' },
          {
            data: ['a', 'b'],
            height: 30,
            position: 'top',
            zoom: { slider: { enabled: true, size: 10 } },
          },
        ]}
        yAxis={[
          { width: 20, position: 'left', zoom: { slider: { enabled: true, size: 10 } } },
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
    expect(getComputedStyle(axesRoot[0]).transform).toBe('matrix(1, 0, 0, 1, 0, 75)'); // xAxis (30 + 10 + 5 + 30)
    expect(getComputedStyle(axesRoot[1]).transform).toBe('matrix(1, 0, 0, 1, 0, 40)'); // xAxis (30 + 10)
    expect(getComputedStyle(axesRoot[2]).transform).toBe('matrix(1, 0, 0, 1, 55, 0)'); // yAxis (20 + 10 + 5 + 20)
    expect(getComputedStyle(axesRoot[3]).transform).toBe('matrix(1, 0, 0, 1, 20, 0)'); // yAxis
  });
});
