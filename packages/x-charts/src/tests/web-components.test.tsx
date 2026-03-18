import * as React from 'react';

import { LineChart } from '@mui/x-charts/LineChart';
import { createRenderer, screen, type MuiRenderResult } from '@mui/internal-test-utils';
import { isJSDOM } from 'test/utils/skipIf';
import { reactToWebComponent } from './web-components';

describe.skipIf(isJSDOM)('Web Components', () => {
  const { render } = createRenderer();
  let root: MuiRenderResult;
  const onAxisClick = vi.fn();

  afterEach(() => {
    onAxisClick.mockClear();
  });

  function BasicLineChart() {
    return (
      <LineChart
        xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
        series={[
          {
            data: [2, 5.5, 2, 8.5, 1.5, 5],
            showMark: true,
          },
        ]}
        height={300}
        onAxisClick={onAxisClick}
      />
    );
  }

  const mount = (container: HTMLElement, ReactComponent: React.ComponentType, props: any) => {
    const view = render(<ReactComponent {...props} />, { container });
    root = view;
    return {
      root,
      ReactComponent,
    };
  };

  const unmount = (ctx: { root: MuiRenderResult }) => {
    ctx.root.unmount();
  };

  customElements.define(
    'web-component-shadow',
    reactToWebComponent(BasicLineChart, { shadow: 'open' }, { mount, unmount }),
  );

  customElements.define(
    'web-component-regular',
    reactToWebComponent(BasicLineChart, {}, { mount, unmount }),
  );

  it('should render the web component in regular mode', async () => {
    const regularElement = document.createElement('web-component-regular');
    regularElement.setAttribute('data-testid', 'regular');
    document.body.appendChild(regularElement);

    onTestFinished(() => {
      regularElement.remove();
    });

    screen.getByTestId('regular');

    const circle = regularElement?.querySelector('circle');

    expect(circle).toBeTruthy();

    const { user } = root;

    await user.click(circle!);

    expect(onAxisClick).toHaveBeenCalledWith(expect.anything(), {
      axisValue: 1,
      dataIndex: 0,
      seriesValues: {
        'auto-generated-id-0': 2,
      },
    });
  });

  it('should render the web component in shadow mode', async () => {
    const shadowElement = document.createElement('web-component-shadow');
    shadowElement.setAttribute('data-testid', 'shadow');
    document.body.appendChild(shadowElement);

    onTestFinished(() => {
      shadowElement.remove();
    });

    screen.getByTestId('shadow');

    expect(shadowElement.shadowRoot).toBeTruthy();

    const circle = shadowElement.shadowRoot?.querySelector('circle');

    expect(circle).toBeTruthy();

    const { user } = root;

    await user.click(circle!);

    expect(onAxisClick).toHaveBeenCalledWith(expect.anything(), {
      axisValue: 1,
      dataIndex: 0,
      seriesValues: {
        'auto-generated-id-0': 2,
      },
    });
  });
});
