import * as React from 'react';
import { expect } from 'chai';
import { ErrorBoundary, createRenderer, reactMajor, screen } from '@mui/internal-test-utils';
import { useSvgRef } from './useSvgRef';
import { ChartProvider } from '../context/ChartProvider';

function UseSvgRef() {
  const ref = useSvgRef();
  return (
    <svg ref={ref} id="test-id">
      {ref.current?.id}
    </svg>
  );
}

describe('useSvgRef', () => {
  const { render } = createRenderer();

  it('should throw an error when parent context not present', function test() {
    if (!/jsdom/.test(window.navigator.userAgent)) {
      // can't catch render errors in the browser for unknown reason
      // tried try-catch + error boundary + window onError preventDefault
      this.skip();
    }

    const errorRef = React.createRef<any>();

    const errorMessages = [
      'MUI X: Could not find the Chart context.',
      'It looks like you rendered your component outside of a ChartDataProvider.',
      'The above error occurred in the <UseSvgRef> component',
    ];
    const expextedError = reactMajor < 19 ? errorMessages : errorMessages.slice(0, 2).join('\n');

    expect(() =>
      render(
        <ErrorBoundary ref={errorRef}>
          <UseSvgRef />
        </ErrorBoundary>,
      ),
    ).toErrorDev(expextedError);

    expect((errorRef.current as any).errors).to.have.length(1);
    expect((errorRef.current as any).errors[0].toString()).to.include(
      'MUI X: Could not find the Chart context.',
    );
  });

  it('should not throw an error when parent context is present', async () => {
    function RenderDrawingProvider() {
      return (
        <ChartProvider>
          <UseSvgRef />
        </ChartProvider>
      );
    }

    const { forceUpdate } = render(<RenderDrawingProvider />);

    // Ref is not available on first render.
    forceUpdate();

    expect(await screen.findByText('test-id')).toBeVisible();
  });
});
