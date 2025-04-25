import * as React from 'react';
import { expect } from 'chai';
import { createRenderer } from '@mui/internal-test-utils';
import { testSkipIf, isJSDOM } from 'test/utils/skipIf';
import { ChartDataProvider } from '@mui/x-charts/ChartDataProvider';
import { clearWarningsCache } from '@mui/x-internals/warning';
import { UseChartPolarAxisSignature } from './useChartPolarAxis.types';
import { useChartPolarAxis } from './useChartPolarAxis';

describe('useChartPolarAxis', () => {
  const { render } = createRenderer();

  beforeEach(() => {
    clearWarningsCache();
  });

  // can't catch render errors in the browser for unknown reason
  // tried try-catch + error boundary + window onError preventDefault
  testSkipIf(!isJSDOM)('should throw an error when axis have duplicate ids', () => {
    const expectedError = [
      'MUI X Charts: The following axis ids are duplicated: qwerty.',
      'Please make sure that each axis has a unique id.',
    ].join('\n');

    expect(() =>
      render(
        <ChartDataProvider<'radar', [UseChartPolarAxisSignature]>
          rotationAxis={[
            { scaleType: 'band', id: 'qwerty', data: ['a', 'b', 'c'] },
            { scaleType: 'band', id: 'qwerty', data: ['a', 'b', 'c'] },
          ]}
          height={100}
          width={100}
          plugins={[useChartPolarAxis]}
        />,
      ),
    ).toErrorDev(expectedError);
  });

  // can't catch render errors in the browser for unknown reason
  // tried try-catch + error boundary + window onError preventDefault
  testSkipIf(!isJSDOM)(
    'should throw an error when axis have duplicate ids across different directions (radius, rotation)',
    () => {
      const expectedError = [
        'MUI X Charts: The following axis ids are duplicated: qwerty.',
        'Please make sure that each axis has a unique id.',
      ].join('\n');

      expect(() =>
        render(
          <ChartDataProvider<'radar', [UseChartPolarAxisSignature]>
            rotationAxis={[{ scaleType: 'band', id: 'qwerty', data: ['a', 'b', 'c'] }]}
            radiusAxis={[{ id: 'qwerty' }]}
            height={100}
            width={100}
            plugins={[useChartPolarAxis]}
          />,
        ),
      ).toErrorDev(expectedError);
    },
  );
});
