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

  it('should not throw an error when parent context is present', () => {
    const ref = React.createRef<SVGSVGElement>();
    // @ts-expect-error, we don't need to create an actual SVG element
    ref.current = { id: 'test-id' } as SVGSVGElement;

    const { getByText } = render(
      <DrawingProvider svgRef={ref} width={1} height={1}>
        <UseSvgRef />
      </DrawingProvider>,
    );

    expect(getByText('test-id')).toBeVisible();
  });
});
