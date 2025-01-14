import * as React from 'react';
import { expect } from 'chai';
import { ErrorBoundary, createRenderer, reactMajor, screen } from '@mui/internal-test-utils';
import { testSkipIf, isJSDOM } from 'test/utils/skipIf';
import { useSeries } from './useSeries';
import { ChartProvider } from '../context/ChartProvider';

function UseSeries() {
  const { bar } = useSeries();
  return <div>{bar?.series['test-id']?.id}</div>;
}

describe('useSeries', () => {
  const { render } = createRenderer();

  // can't catch render errors in the browser for unknown reason
  // tried try-catch + error boundary + window onError preventDefault
  testSkipIf(!isJSDOM)('should throw an error when parent context not present', () => {
    const errorRef = React.createRef<any>();

    const errorMessage1 = 'MUI X: Could not find the Chart context.';
    const errorMessage2 =
      'It looks like you rendered your component outside of a ChartDataProvider.';
    const errorMessage3 = 'The above error occurred in the <UseSeries> component:';
    const expectedError =
      reactMajor < 19
        ? [errorMessage1, errorMessage2, errorMessage3]
        : [errorMessage1, errorMessage2].join('\n');

    expect(() =>
      render(
        <ErrorBoundary ref={errorRef}>
          <UseSeries />
        </ErrorBoundary>,
      ),
    ).toErrorDev(expectedError);

    expect((errorRef.current as any).errors).to.have.length(1);
    expect((errorRef.current as any).errors[0].toString()).to.include(errorMessage1);
  });

  it('should not throw an error when parent context is present', () => {
    render(
      <ChartProvider
        pluginParams={{
          series: [{ type: 'bar', id: 'test-id', data: [1, 2] }],
          width: 200,
          height: 200,
        }}
      >
        <UseSeries />
      </ChartProvider>,
    );

    expect(screen.getByText('test-id')).toBeVisible();
  });
});
