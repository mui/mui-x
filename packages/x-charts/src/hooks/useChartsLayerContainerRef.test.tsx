import * as React from 'react';
import { ErrorBoundary, createRenderer, screen } from '@mui/internal-test-utils';
import { useChartsLayerContainerRef } from './useChartsLayerContainerRef';
import { ChartsProvider } from '../context/ChartsProvider';

function UseChartsLayerContainerRef() {
  const ref = useChartsLayerContainerRef();
  return (
    <div ref={ref} id="test-id">
      {ref.current?.id}
    </div>
  );
}

describe('useChartsLayerContainerRef', () => {
  const { render } = createRenderer();

  it('should throw an error when parent context not present', () => {
    const errorRef = React.createRef<any>();

    const expectedError = [
      'The above error occurred in the <UseChartsLayerContainerRef> component',
    ];

    expect(() =>
      render(
        <ErrorBoundary ref={errorRef}>
          <UseChartsLayerContainerRef />
        </ErrorBoundary>,
      ),
    ).toErrorDev(expectedError);

    expect((errorRef.current as any).errors).to.have.length(1);
    expect((errorRef.current as any).errors[0].toString()).to.include(
      'MUI X Charts: Could not find the Charts context. ',
    );
  });

  it('should not throw an error when parent context is present', async () => {
    function RenderDrawingProvider() {
      return (
        <ChartsProvider pluginParams={{ width: 200, height: 200 }}>
          <UseChartsLayerContainerRef />
        </ChartsProvider>
      );
    }

    const { forceUpdate } = render(<RenderDrawingProvider />);

    // Ref is not available on first render.
    forceUpdate();

    expect(await screen.findByText('test-id')).toBeVisible();
  });
});
