const renderSymbol = Symbol.for('render');
const connectedSymbol = Symbol.for('connected');
const contextSymbol = Symbol.for('context');
const propsSymbol = Symbol.for('props');

// This function creates a custom web component that wraps a React component.
// Adapted from https://github.com/bitovi/react-to-web-component/blob/b1372bfd7bc67fe49920db840f1ed9cf736b2724/packages/core/src/core.ts
export function reactToWebComponent<Props extends { container?: HTMLElement }, Ctx>(
  ReactComponent: React.ComponentType<Props>,
  options: { shadow?: 'open' | 'closed' },
  renderer: {
    mount: (
      container: HTMLElement,
      ReactComponent: React.ComponentType<Props>,
      props: Props,
    ) => Ctx;
    unmount: (ctx: Ctx) => void;
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
      }
    }
  }

  return ReactWebComponent;
}
