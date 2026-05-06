import * as React from 'react';
import { spy } from 'sinon';
import { createRenderer, screen, waitFor } from '@mui/internal-test-utils/createRenderer';
import { AsyncScatterPlot } from '@mui/x-charts/AsyncScatterPlot';
import { isJSDOM } from 'test/utils/skipIf';

describe('<AsyncScatterPlot />', () => {
  const { render } = createRenderer();

  it('renders the skeleton placeholder on initial mount', () => {
    render(
      <AsyncScatterPlot
        data={[
          { x: 0, y: 0 },
          { x: 1, y: 1 },
        ]}
        width={400}
        height={200}
      />,
    );

    expect(screen.getByText('Loading…')).not.to.equal(null);
  });

  it('renders custom loading content when provided', () => {
    render(
      <AsyncScatterPlot
        data={[
          { x: 0, y: 0 },
          { x: 1, y: 1 },
        ]}
        width={400}
        height={200}
        loading={<text data-testid="custom-skeleton">custom</text>}
      />,
    );

    expect(screen.getByTestId('custom-skeleton')).not.to.equal(null);
  });

  it.skipIf(isJSDOM)('swaps the skeleton for path elements after the worker returns', async () => {
    const onLoadEnd = spy();
    const { container } = render(
      <AsyncScatterPlot
        data={[
          { x: 0, y: 0 },
          { x: 1, y: 1 },
          { x: 2, y: 0.5 },
        ]}
        width={400}
        height={200}
        onLoadEnd={onLoadEnd}
      />,
    );

    await waitFor(() => {
      expect(onLoadEnd.called).to.equal(true);
    });

    expect(container.querySelectorAll('path').length).to.be.greaterThan(0);
    const info = onLoadEnd.firstCall.args[0];
    expect(info.pointCount).to.equal(3);
  });
});
