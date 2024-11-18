import * as React from 'react';
import { expect } from 'chai';
import { ErrorBoundary, createRenderer, screen } from '@mui/internal-test-utils';
import { useSvgRef } from './useSvgRef';
import { SvgRefProvider, useSurfaceRef } from '../context/SvgRefProvider';

function UseSvgRef() {
  const ref = useSvgRef();
  return <div>{ref.current?.id}</div>;
}

function UseSurfaceRef({ children }: any) {
  const ref = useSurfaceRef();
  return (
    <svg ref={ref} id="test-id">
      {children}
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

    expect(() =>
      render(
        <ErrorBoundary ref={errorRef}>
          <UseSvgRef />
        </ErrorBoundary>,
      ),
    ).toErrorDev([
      'MUI X: Could not find the svg ref context.',
      'It looks like you rendered your component outside of a ChartsContainer parent component.',
      'The above error occurred in the <UseSvgRef> component:',
    ]);

    expect((errorRef.current as any).errors).to.have.length(1);
    expect((errorRef.current as any).errors[0].toString()).to.include(
      'MUI X: Could not find the svg ref context.',
    );
  });

  it('should not throw an error when parent context is present', async () => {
    function RenderDrawingProvider() {
      return (
        <SvgRefProvider>
          <UseSurfaceRef>
            <UseSvgRef />
          </UseSurfaceRef>
        </SvgRefProvider>
      );
    }

    const { forceUpdate } = render(<RenderDrawingProvider />);

    // Ref is not available on first render.
    forceUpdate();

    expect(await screen.findByText('test-id')).toBeVisible();
  });
});
