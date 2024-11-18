import * as React from 'react';
import { expect } from 'chai';
import { ErrorBoundary, createRenderer, reactMajor, screen } from '@mui/internal-test-utils';
import { useSeries } from './useSeries';
import { SeriesProvider } from '../context/SeriesProvider';
import { PluginProvider } from '../internals';

function UseSeries() {
  const { bar } = useSeries();
  return <div>{bar?.series['test-id']?.id}</div>;
}

describe('useSeries', () => {
  const { render } = createRenderer();

  it('should throw an error when parent context not present', function test() {
    if (!/jsdom/.test(window.navigator.userAgent)) {
      // can't catch render errors in the browser for unknown reason
      // tried try-catch + error boundary + window onError preventDefault
      this.skip();
    }

    const errorRef = React.createRef<any>();

    const errorMessage1 = 'MUI X: Could not find the series ref context.';
    const errorMessage2 =
      'It looks like you rendered your component outside of a ChartsContainer parent component.';
    const errorMessage3 = 'The above error occurred in the <UseSeries> component:';
    const expextedError =
      reactMajor < 19
        ? [errorMessage1, errorMessage2, errorMessage3]
        : `${errorMessage1}\n${errorMessage2}`;

    expect(() =>
      render(
        <ErrorBoundary ref={errorRef}>
          <UseSeries />
        </ErrorBoundary>,
      ),
    ).toErrorDev(expextedError);

    expect((errorRef.current as any).errors).to.have.length(1);
    expect((errorRef.current as any).errors[0].toString()).to.include(
      'MUI X: Could not find the series ref context.',
    );
  });

  it('should not throw an error when parent context is present', () => {
    render(
      <PluginProvider>
        <SeriesProvider series={[{ type: 'bar', id: 'test-id', data: [1, 2] }]}>
          <UseSeries />
        </SeriesProvider>
      </PluginProvider>,
    );

    expect(screen.getByText('test-id')).toBeVisible();
  });
});
