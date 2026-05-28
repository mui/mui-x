import { createRenderer, screen } from '@mui/internal-test-utils';
import { BarChart } from '@mui/x-charts/BarChart';

describe('useChartCartesianAxis', () => {
  const { render } = createRenderer();

  describe('experimentalFeatures.responsiveTickAdjustment', () => {
    const manyCategories = Array.from({ length: 20 }, (_, i) => `cat-${i}`);
    const data = manyCategories.map((_, i) => i);

    it('should render one tick per band when the feature is disabled', () => {
      render(
        <BarChart
          xAxis={[{ data: manyCategories, scaleType: 'band' }]}
          series={[{ data }]}
          width={300}
          height={200}
          margin={0}
        />,
      );

      const tickLabels = screen.getAllByTestId('ChartsXAxisTickLabel');
      expect(tickLabels).toHaveLength(manyCategories.length);
    });

    it('should thin ticks on a band axis based on the drawing area width when the feature is enabled', () => {
      render(
        <BarChart
          xAxis={[{ data: manyCategories, scaleType: 'band' }]}
          series={[{ data }]}
          width={300}
          height={200}
          margin={0}
          experimentalFeatures={{ responsiveTickAdjustment: true }}
        />,
      );

      const tickLabels = screen.getAllByTestId('ChartsXAxisTickLabel');
      // With ~280px of drawing area and a 50px default spacing, we expect
      // roughly width / 50 ticks instead of one per band.
      expect(tickLabels.length).toBeLessThan(manyCategories.length);
      expect(tickLabels.length).toBeGreaterThan(0);
    });

    it('should not override an explicit tickSpacing when the feature is enabled', () => {
      render(
        <BarChart
          xAxis={[{ data: manyCategories, scaleType: 'band', tickSpacing: 10 }]}
          series={[{ data }]}
          width={300}
          height={200}
          margin={0}
          experimentalFeatures={{ responsiveTickAdjustment: true }}
        />,
      );

      // tickSpacing of 10px on a ~280px area should keep every band's tick.
      const tickLabels = screen.getAllByTestId('ChartsXAxisTickLabel');
      expect(tickLabels).toHaveLength(manyCategories.length);
    });
  });

  it('should throw an error when axis have duplicate ids', () => {
    const expectedError = [
      'MUI X Charts: The following axis ids are duplicated: qwerty.',
      'Please make sure that each axis has a unique id.',
    ].join('\n');

    expect(() =>
      render(
        <BarChart
          xAxis={[
            { id: 'qwerty', data: ['a', 'b', 'c'], position: 'none' },
            { id: 'qwerty', data: ['a', 'b', 'c'], position: 'none' },
          ]}
          series={[{ data: [1, 2, 3] }]}
          height={100}
          width={100}
        />,
      ),
    ).toErrorDev(expectedError);
  });

  it('should throw an error when axis have duplicate ids across different directions (x,y)', () => {
    const expectedError = [
      'MUI X Charts: The following axis ids are duplicated: qwerty.',
      'Please make sure that each axis has a unique id.',
    ].join('\n');

    expect(() =>
      render(
        <BarChart
          xAxis={[{ id: 'qwerty', data: ['a', 'b', 'c'] }]}
          yAxis={[{ id: 'qwerty' }]}
          series={[{ data: [1, 2, 3] }]}
          height={100}
          width={100}
        />,
      ),
    ).toErrorDev(expectedError);
  });
});
