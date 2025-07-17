const renderSymbol = Symbol.for('render');
const connectedSymbol = Symbol.for('connected');
const contextSymbol = Symbol.for('context');
const propsSymbol = Symbol.for('props');

export function reactToWebComponent<Props extends { container?: HTMLElement }, Ctx>(
  ReactComponent: React.ComponentType<Props>,
  options: { shadow?: 'open' | 'closed' },
  renderer: {
    mount: (
      container: HTMLElement,
      ReactComponent: React.ComponentType<Props>,
      props: Props,
    ) => Ctx;
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
