import * as React from 'react';

import { LineChart } from '@mui/x-charts/LineChart';
import { createRenderer, screen, type MuiRenderResult } from '@mui/internal-test-utils';
import { reactToWebComponent } from './web-components';

describe('Web Components', () => {
  const { render } = createRenderer();
  let root: MuiRenderResult;
  const onClick = vi.fn();

  afterEach(() => {
    onClick.mockClear();
  });

  function BasicLineChart() {
    return (
      <LineChart
        xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
        series={[
          {
            data: [2, 5.5, 2, 8.5, 1.5, 5],
          },
        ]}
        height={300}
        onAxisClick={onClick}
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

  customElements.define(
    'web-component-shadow',
    reactToWebComponent(BasicLineChart, { shadow: 'open' }, { mount }),
  );

  customElements.define(
    'web-component-regular',
    reactToWebComponent(BasicLineChart, {}, { mount }),
  );

  it('should render the web component in regular mode', async () => {
    const regularElement = document.createElement('web-component-regular');
    regularElement.setAttribute('data-testid', 'regular');
    document.body.appendChild(regularElement);

    screen.getByTestId('regular');

    const circle = regularElement?.querySelector('circle');

    expect(circle).toBeDefined();

    const { user } = root;

    await user.click(circle!);

    expect(onClick).toHaveBeenCalledWith(expect.anything(), {
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

    screen.getByTestId('shadow');

    expect(shadowElement.shadowRoot).toBeDefined();

    const circle = shadowElement.shadowRoot?.querySelector('circle');

    expect(circle).toBeDefined();

    const { user } = root;

    await user.click(circle!);

    expect(onClick).toHaveBeenCalledWith(expect.anything(), {
      axisValue: 1,
      dataIndex: 0,
      seriesValues: {
        'auto-generated-id-0': 2,
      },
    });
  });
});
