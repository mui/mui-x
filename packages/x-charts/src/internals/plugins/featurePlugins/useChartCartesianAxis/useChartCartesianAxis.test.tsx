import { createRenderer } from '@mui/internal-test-utils';
import { isJSDOM } from 'test/utils/skipIf';
import { BarChart } from '@mui/x-charts/BarChart';

describe('useChartCartesianAxis', () => {
  const { render } = createRenderer();

  // can't catch render errors in the browser for unknown reason
  // tried try-catch + error boundary + window onError preventDefault
  it.skipIf(!isJSDOM)('should throw an error when axis have duplicate ids', () => {
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

  // can't catch render errors in the browser for unknown reason
  // tried try-catch + error boundary + window onError preventDefault
  it.skipIf(!isJSDOM)(
    'should throw an error when axis have duplicate ids across different directions (x,y)',
    () => {
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
    },
  );
});
