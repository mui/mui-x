import * as React from 'react';
import { ErrorBoundary, createRenderer, reactMajor, screen } from '@mui/internal-test-utils';
import { isJSDOM } from 'test/utils/skipIf';
import { useSeries } from './useSeries';
import { ChartProvider } from '../context/ChartProvider';
import { defaultSeriesConfig } from '../internals/plugins/utils/defaultSeriesConfig';

function UseSeries() {
  const { bar } = useSeries();
  return <div>{bar?.series['test-id']?.id}</div>;
}

describe('useSeries', () => {
  const { render } = createRenderer();

  // can't catch render errors in the browser for unknown reason
  // tried try-catch + error boundary + window onError preventDefault
  it.skipIf(!isJSDOM)('should throw an error when parent context not present', () => {
    const errorRef = React.createRef<any>();

    const errorMessage1 = `MUI X Charts: Could not find the Chart context. This happens when the component is rendered outside of a ChartsDataProvider or ChartsContainer parent component, which means the required context is not available. Wrap your component in a ChartsDataProvider or ChartsContainer. This can also happen if you are bundling multiple versions of the library.`;
    const errorMessage2 = 'The above error occurred in the <UseSeries> component';
    const expectedError = reactMajor < 19 ? [errorMessage2] : [errorMessage1];

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
      <ChartProvider<'bar'>
        pluginParams={{
          series: [{ type: 'bar', id: 'test-id', data: [1, 2] }],
          width: 200,
          height: 200,
          seriesConfig: defaultSeriesConfig,
        }}
      >
        <UseSeries />
      </ChartProvider>,
    );

    expect(screen.getByText('test-id')).toBeVisible();
  });
});
