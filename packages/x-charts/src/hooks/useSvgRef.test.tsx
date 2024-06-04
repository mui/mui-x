import * as React from 'react';
import { expect } from 'chai';
import { ErrorBoundary, createRenderer } from '@mui/internal-test-utils';
import { useSvgRef } from './useSvgRef';
import { DrawingProvider } from '../context/DrawingProvider';

function UseSvgRef() {
  const ref = useSvgRef();
  return <div>{ref.current?.id}</div>;
}

describe('useSvgRef', () => {
  const { render } = createRenderer();

  it('should throw an error when parent context not present', () => {
    expect(() =>
      render(
        <ErrorBoundary>
          <UseSvgRef />
        </ErrorBoundary>,
      ),
    ).toErrorDev([
      'MUI X: Could not find the svg ref context.',
      'It looks like you rendered your component outside of a ChartsContainer parent component.',
      'The above error occurred in the <UseSvgRef> component:',
    ]);
  });

  it('should not throw an error when parent context is present', async () => {
    function RenderDrawingProvider() {
      const ref = React.useRef<SVGSVGElement | null>(null);

      return (
        <svg ref={ref} id="test-id">
          <DrawingProvider svgRef={ref} width={1} height={1}>
            <UseSvgRef />
          </DrawingProvider>
        </svg>
      );
    }

    const { findByText, forceUpdate } = render(<RenderDrawingProvider />);

    // Ref is not available on first render.
    forceUpdate();

    expect(await findByText('test-id')).toBeVisible();
  });
});
