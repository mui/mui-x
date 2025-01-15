import * as React from 'react';
import { expect } from 'chai';
import { createRenderer, reactMajor } from '@mui/internal-test-utils';
import { testSkipIf, isJSDOM } from 'test/utils/skipIf';
import { BarChart } from '@mui/x-charts/BarChart';

describe('useChartCartesianAxis', () => {
  const { render } = createRenderer();

  // can't catch render errors in the browser for unknown reason
  // tried try-catch + error boundary + window onError preventDefault
  testSkipIf(!isJSDOM)('should throw an error when axis have duplicate ids', () => {
    const errorMessage1 = 'MUI X: The following axis ids are duplicated: qwerty.';
    const errorMessage2 = 'Please make sure that each axis has a unique id.';
    const expectedError =
      reactMajor < 19 ? [errorMessage1, errorMessage2] : `${errorMessage1}\n${errorMessage2}`;

    expect(() =>
      render(
        <BarChart xAxis={[{ id: 'qwerty' }, { id: 'qwerty' }]} series={[{ data: [1, 2, 3] }]} />,
      ),
    ).toErrorDev(expectedError);
  });

  // can't catch render errors in the browser for unknown reason
  // tried try-catch + error boundary + window onError preventDefault
  testSkipIf(!isJSDOM)(
    'should throw an error when axis have duplicate ids across different directions (x,y)',
    () => {
      const errorMessage1 = 'MUI X: The following axis ids are duplicated: qwerty.';
      const errorMessage2 = 'Please make sure that each axis has a unique id.';
      const expectedError =
        reactMajor < 19 ? [errorMessage1, errorMessage2] : `${errorMessage1}\n${errorMessage2}`;

      expect(() =>
        render(
          <BarChart
            xAxis={[{ id: 'qwerty' }]}
            yAxis={[{ id: 'qwerty' }]}
            series={[{ data: [1, 2, 3] }]}
          />,
        ),
      ).toErrorDev(expectedError);
    },
  );
});
