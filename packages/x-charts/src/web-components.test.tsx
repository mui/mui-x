import * as React from 'react';

import { LineChart } from '@mui/x-charts/LineChart';
import { createRenderer, screen, type MuiRenderResult } from '@mui/internal-test-utils';

const renderSymbol = Symbol.for('render');
const connectedSymbol = Symbol.for('connected');
const contextSymbol = Symbol.for('context');
const propsSymbol = Symbol.for('props');

function reactToWebComponent<Props extends { container?: HTMLElement }, Ctx>(
  ReactComponent: React.ComponentType<Props>,
  options: { shadow?: 'open' | 'closed' },
  renderer: {
    mount: (
      container: HTMLElement,
      ReactComponent: React.ComponentType<Props>,
      props: Props,
    ) => Ctx;
    update: (context: Ctx, props: Props) => void;
    unmount: (context: Ctx) => void;
  },
): CustomElementConstructor {
  class ReactWebComponent extends HTMLElement {
    static get observedAttributes() {
      return [];
    }

    [connectedSymbol] = true;

    [contextSymbol]?: Ctx;

    [propsSymbol]: Props = {} as Props;

    container: HTMLElement;

    constructor() {
      super();

      if (options.shadow) {
        this.container = this.attachShadow({
          mode: options.shadow,
        }) as unknown as HTMLElement;
      } else {
        this.container = this;
      }

      this[propsSymbol].container = this.container;
    }

    connectedCallback() {
      this[connectedSymbol] = true;
      this[renderSymbol]();
    }

    disconnectedCallback() {
      this[connectedSymbol] = false;

      if (this[contextSymbol]) {
        renderer.unmount(this[contextSymbol]);
      }
      delete this[contextSymbol];
    }

    [renderSymbol]() {
      if (!this[connectedSymbol]) {
        return;
      }

      if (!this[contextSymbol]) {
        this[contextSymbol] = renderer.mount(this.container, ReactComponent, this[propsSymbol]);
      } else {
        renderer.update(this[contextSymbol], this[propsSymbol]);
      }
    }
  }

  return ReactWebComponent;
}

function BasicLineChart() {
  return (
    <React.Fragment>
      <LineChart
        xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
        series={[
          {
            data: [2, 5.5, 2, 8.5, 1.5, 5],
          },
        ]}
        height={300}
      />
      {}
      <button
        type="button"
        // eslint-disable-next-line no-console
        onClick={() => console.log('Button clicked!')}
      >
        Click Me
      </button>
    </React.Fragment>
  );
}

describe('Web Components', () => {
  const { render } = createRenderer();
  let root: MuiRenderResult;
  let consoleMock: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleMock = vi.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    consoleMock.mockRestore();
    document.body.innerHTML = '';
    root?.unmount();
  });

  customElements.define(
    'web-component-shadow',
    reactToWebComponent(
      BasicLineChart,
      {
        shadow: 'open',
      },
      {
        mount: (container, ReactComponent, props) => {
          const view = render(<ReactComponent {...props} />, {
            container,
          });
          root = view;
          return {
            root,
            ReactComponent,
          };
        },
        update: (context, props) => {
          context.root.rerender(<context.ReactComponent {...props} />);
        },
        unmount: (context) => {
          context.root.unmount();
        },
      },
    ),
  );

  it('should render the web component', async () => {
    const shadowElement = document.createElement('web-component-shadow');
    shadowElement.setAttribute('data-testid', 'shadow');
    document.body.appendChild(shadowElement);

    const { user } = root;

    screen.getByTestId('shadow');

    expect(shadowElement.shadowRoot).toBeDefined();

    const button = shadowElement.shadowRoot?.querySelector('button');

    expect(button).toBeDefined();

    await user.click(button!);

    expect(consoleMock).toHaveBeenCalledWith('Button clicked!');
  });
});
