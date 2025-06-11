/* Adapted from https://github.com/mui/base-ui/blob/c52a6ab0c5982263e10028756a8792234eeadf42/packages/react/src/utils/types.ts */
import * as React from 'react';

export type HTMLProps<T = any> = React.HTMLAttributes<T> & {
  ref?: React.Ref<T> | undefined;
};

export type MUIXEvent<E extends React.SyntheticEvent<Element, Event>> = E & {
  preventMUIXHandler: () => void;
  readonly muiXUIHandlerPrevented?: boolean;
};

type WithPreventMUIXUIHandler<T> = T extends (event: infer E) => any
  ? E extends React.SyntheticEvent<Element, Event>
    ? (event: MUIXEvent<E>) => ReturnType<T>
    : T
  : T extends undefined
    ? undefined
    : T;

/**
 * Adds a `preventMUIXUIHandler` method to all event handlers.
 */
export type WithMUIXUIEvent<T> = {
  [K in keyof T]: WithPreventMUIXUIHandler<T[K]>;
};

/**
 * Shape of the render prop: a function that takes props to be spread on the element and component's state and returns a React element.
 *
 * @param {Props} props Props
 * @param {State} state state
 * @returns {React.ReactElement} React element to be rendered.
 * @template Props Props to be spread on the rendered element.
 * @template State Component's internal state.
 */
export type ComponentRenderFn<Props, State> = (
  props: Props,
  state: State,
) => React.ReactElement<unknown>;

/**
 * Props shared by all MUI X UI components.
 * Contains `className` (string or callback taking the component's state as an argument) and `render` (function to customize rendering).
 */
export type MUIXUIComponentProps<
  ElementType extends React.ElementType,
  State,
  RenderFunctionProps = HTMLProps,
> = Omit<
  WithMUIXUIEvent<React.ComponentPropsWithoutRef<ElementType>>,
  'className' | 'color' | 'defaultValue' | 'defaultChecked'
> & {
  /**
   * CSS class applied to the element, or a function that
   * returns a class based on the component's state.
   */
  className?: string | ((state: State) => string);
  /**
   * Allows you to replace the component's HTML element
   * with a different tag, or compose it with another component.
   *
   * Accepts a `ReactElement` or a function that returns the element to render.
   */
  render?:
    | ComponentRenderFn<RenderFunctionProps, State>
    | React.ReactElement<Record<string, unknown>>;
};

/**
 * Simplifies the display of a type (without modifying it).
 * Taken from https://effectivetypescript.com/2022/02/25/gentips-4-display/
 */
export type Simplify<T> = T extends Function ? T : { [K in keyof T]: T[K] };
