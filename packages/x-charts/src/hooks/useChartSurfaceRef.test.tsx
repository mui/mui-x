import * as React from 'react';
import { ErrorBoundary, createRenderer, screen } from '@mui/internal-test-utils';
import { isJSDOM } from 'test/utils/skipIf';
import { useChartSurfaceRef } from './useChartSurfaceRef';
import { ChartProvider } from '../context/ChartProvider';

function UseChartSurfaceRef() {
  const ref = useChartSurfaceRef();
  return (
    <div ref={ref} id="test-id">
      {ref.current?.id}
    </div>
  );
}

describe('useChartSurfaceRef', () => {
  const { render } = createRenderer();

  // can't catch render errors in the browser for unknown reason
  // tried try-catch + error boundary + window onError preventDefault
  it.skipIf(!isJSDOM)('should throw an error when parent context not present', () => {
    const errorRef = React.createRef<any>();

    const expectedError = ['The above error occurred in the <UseChartSurfaceRef> component'];

    expect(() =>
      render(
        <ErrorBoundary ref={errorRef}>
          <UseChartSurfaceRef />
        </ErrorBoundary>,
      ),
    ).toErrorDev(expectedError);

    expect((errorRef.current as any).errors).to.have.length(1);
    expect((errorRef.current as any).errors[0].toString()).to.include(
      'MUI X Charts: Could not find the Chart context.',
    );
  });

  it('should not throw an error when parent context is present', async () => {
    function RenderDrawingProvider() {
      return (
        <ChartProvider pluginParams={{ width: 200, height: 200 }}>
          <UseChartSurfaceRef />
        </ChartProvider>
      );
    }

    const { forceUpdate } = render(<RenderDrawingProvider />);

    // Ref is not available on first render.
    forceUpdate();

    expect(await screen.findByText('test-id')).toBeVisible();
  });
});
