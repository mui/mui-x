import * as React from 'react';
import { expect } from 'chai';
import { createRenderer } from '@mui/internal-test-utils';
import { testSkipIf, isJSDOM } from 'test/utils/skipIf';
import { BarChart } from '@mui/x-charts/BarChart';
import { clearWarningsCache } from '@mui/x-internals/warning';

describe('useChartCartesianAxis', () => {
  const { render } = createRenderer();

  beforeEach(() => {
    clearWarningsCache();
  });

  // can't catch render errors in the browser for unknown reason
  // tried try-catch + error boundary + window onError preventDefault
  testSkipIf(!isJSDOM)('should throw an error when axis have duplicate ids', () => {
    const expectedError = [
      'MUI X: The following axis ids are duplicated: qwerty.',
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
  testSkipIf(!isJSDOM)(
    'should throw an error when axis have duplicate ids across different directions (x,y)',
    () => {
      const expectedError = [
        'MUI X: The following axis ids are duplicated: qwerty.',
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
