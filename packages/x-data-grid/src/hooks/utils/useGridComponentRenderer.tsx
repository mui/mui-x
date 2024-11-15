import * as React from 'react';

export type ComponentRenderFn<Props, State> = (
  props: Props,
  state: State,
) => React.ReactElement<unknown>;

export type RenderProp<State> =
  | ComponentRenderFn<React.HTMLAttributes<any>, State>
  | React.ReactElement;

type GridComponentRendererOptions<Props, State> = {
  defaultElement: React.ComponentType<Props>;
  props: Props;
  state?: State;
  render?: RenderProp<State>;
};

/**
 * Returns a function that renders a component.
 *
 * @ignore - internal hook.
 */
export function useGridComponentRenderer<
  Props extends React.HTMLAttributes<any>,
  State extends Record<string, any>,
>({
  defaultElement,
  props,
  state = {} as State,
  render,
}: GridComponentRendererOptions<Props, State>) {
  const renderElement = () => {
    if (typeof render === 'function') {
      return render(props, state);
    }
    if (render) {
      return React.cloneElement(render, props);
    }
    return React.createElement(defaultElement, props);
  };

  return { renderElement };
}
