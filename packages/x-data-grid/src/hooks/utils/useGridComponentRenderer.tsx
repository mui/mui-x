import * as React from 'react';
import clsx from 'clsx';
import { SxProps } from '@mui/system';

export type ComponentRenderFn<Props, State> = (
  props: Props,
  state: State,
) => React.ReactElement<unknown>;

export type RenderProp<Props, State = {}> =
  | ComponentRenderFn<Props, State>
  | React.ReactElement<Props>;

/**
 * Resolves the rendering logic for a component.
 * Handles three scenarios:
 * 1. A render function that receives props and state
 * 2. A React element
 * 3. A default element
 *
 * @ignore - internal hook.
 */
export function useGridComponentRenderer<
  Props extends React.HTMLAttributes<any>,
  State extends Record<string, any>,
>(
  defaultElement: keyof React.JSX.IntrinsicElements | React.ComponentType<Props>,
  render: RenderProp<Props, State> | undefined,
  props: Props,
  state: State = {} as State,
) {
  if (typeof render === 'function') {
    return render(props, state);
  }

  if (render) {
    if (render.props.className) {
      props.className = clsx(render.props.className, props.className);
    }
    if (render.props.style || props.style) {
      props.style = { ...props.style, ...render.props.style };
    }
    if ((render.props as any).sx || (props as any).sx) {
      (props as any).sx = mergeSx((props as any).sx, (render.props as any).sx);
    }
    return React.cloneElement(render, props);
  }

  return React.createElement(defaultElement, props);
}

function mergeSx(sx1: SxProps, sx2: SxProps) {
  if (!sx1 || !sx2) {
    return sx1 || sx2;
  }
  return (Array.isArray(sx1) ? sx1 : [sx1]).concat(Array.isArray(sx2) ? sx2 : [sx2]);
}
