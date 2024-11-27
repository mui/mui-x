import * as React from 'react';
import clsx from 'clsx';
import { SxProps } from '@mui/system';

type ExtendedHTMLAttributes = React.HTMLAttributes<any> & {
  [key: `data-${string}`]: string | undefined;
};

export type ComponentRenderFn<Props, State> = (
  props: Props,
  state: State,
) => React.ReactElement<unknown>;

export type RenderProp<State> =
  | ComponentRenderFn<ExtendedHTMLAttributes, State>
  | React.ReactElement;

type GridComponentRendererOptions<Props, State> = {
  defaultElement: keyof JSX.IntrinsicElements | React.ComponentType<Props>;
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
  Props extends ExtendedHTMLAttributes,
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
      const className = clsx(render.props.className, props.className);
      const style = { ...render.props.style, ...props.style };
      const sx = mergeSx(render.props.sx, (props as any).sx);
      return React.cloneElement(render, { ...props, className, style, sx });
    }

    return React.createElement(defaultElement, props);
  };

  return { renderElement };
}

function mergeSx(sx1: SxProps | undefined, sx2: SxProps | undefined) {
  if (!sx1 && !sx2) {
    return undefined;
  }
  if (!sx1 || !sx2) {
    return sx1 || sx2;
  }
  return [...(Array.isArray(sx1) ? sx1 : [sx1]), ...(Array.isArray(sx2) ? sx2 : [sx2])];
}
