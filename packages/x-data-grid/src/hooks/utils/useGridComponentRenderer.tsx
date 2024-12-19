import * as React from 'react';
import clsx from 'clsx';
import { SxProps } from '@mui/system';

export type ComponentRenderFn<Props, State> = (
  props: Props,
  state: State,
) => React.ReactElement<unknown>;

export type RenderProp<Props, State = {}> = ComponentRenderFn<Props, State> | React.ReactElement;

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
  defaultElement: keyof JSX.IntrinsicElements | React.ComponentType<Props>,
  render: RenderProp<Props, State> | undefined,
  props: Props,
  state: State = {} as State,
) {
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
