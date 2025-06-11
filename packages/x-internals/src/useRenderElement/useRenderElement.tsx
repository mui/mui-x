/* Copied from https://github.com/mui/base-ui/blob/c52a6ab0c5982263e10028756a8792234eeadf42/packages/react/src/utils/useRenderElement.tsx */
import * as React from 'react';
import type { MUIXUIComponentProps, ComponentRenderFn, HTMLProps } from './types';
import { CustomStyleHookMapping, getStyleHookProps } from './getStyleHookProps';
import { useForkRef, useForkRefN } from '../useForkRef';
import { resolveClassName } from './resolveClassName';
import { mergeProps, mergePropsN } from './mergeProps';
import { mergeObjects } from './mergeObjects';
import reactMajor from '../reactMajor';

const EMPTY_OBJECT = {};

/**
 * Renders a MUI X UI element.
 *
 * @param element The default HTML element to render. Can be overridden by the `render` prop.
 * @param componentProps An object containing the `render` and `className` props to be used for element customization. Other props are ignored.
 * @param params Additional parameters for rendering the element.
 */
export function useRenderElement<
  State extends Record<string, any>,
  RenderedElementType extends Element,
  TagName extends React.ElementType | undefined,
  Enabled extends boolean | undefined = undefined,
>(
  element: TagName,
  componentProps: useRenderElement.ComponentProps<State>,
  params: useRenderElement.Parameters<State, RenderedElementType, TagName, Enabled> = {},
): Enabled extends false ? null : React.ReactElement<Record<string, unknown>> {
  const renderProp = componentProps.render;
  const outProps = useRenderElementProps(componentProps, params);
  if (params.enabled === false) {
    return null as Enabled extends false ? null : React.ReactElement<Record<string, unknown>>;
  }

  const state = params.state ?? (EMPTY_OBJECT as State);
  return evaluateRenderProp(element, renderProp, outProps, state) as Enabled extends false
    ? null
    : React.ReactElement<Record<string, unknown>>;
}

/**
 * Computes render element final props.
 */
function useRenderElementProps<
  State extends Record<string, any>,
  RenderedElementType extends Element,
  TagName extends React.ElementType | undefined,
  Enabled extends boolean | undefined,
>(
  componentProps: useRenderElement.ComponentProps<State>,
  params: useRenderElement.Parameters<State, RenderedElementType, TagName, Enabled> = {},
): React.HTMLAttributes<any> & React.RefAttributes<any> {
  const { className: classNameProp, render: renderProp } = componentProps;

  const {
    state = EMPTY_OBJECT as State,
    ref,
    props,
    disableStyleHooks,
    customStyleHookMapping,
    enabled = true,
  } = params;

  const className = enabled ? resolveClassName(classNameProp, state) : undefined;

  let styleHooks: Record<string, string> | undefined;
  if (disableStyleHooks !== true) {
    // SAFETY: We use typings to ensure `disableStyleHooks` is either always set or
    // always unset, so this `if` block is stable across renders.
    /* eslint-disable-next-line react-hooks/rules-of-hooks */
    styleHooks = React.useMemo(
      () => (enabled ? getStyleHookProps(state, customStyleHookMapping) : EMPTY_OBJECT),
      [state, customStyleHookMapping, enabled],
    );
  }

  const outProps: React.HTMLAttributes<any> & React.RefAttributes<any> = enabled
    ? (mergeObjects(styleHooks, Array.isArray(props) ? mergePropsN(props) : props) ?? EMPTY_OBJECT)
    : EMPTY_OBJECT;

  // SAFETY: The `useForkRef` functions use a single hook to store the same value,
  // switching between them at runtime is safe. If this assertion fails, React will
  // throw at runtime anyway.
  /* eslint-disable react-hooks/rules-of-hooks */
  if (!enabled) {
    useForkRef(null, null);
  } else if (Array.isArray(ref)) {
    outProps.ref = useForkRefN(outProps.ref, getChildRef(renderProp), ...ref);
  } else {
    outProps.ref = useForkRef(outProps.ref, getChildRef(renderProp), ref);
  }
  /* eslint-enable react-hooks/rules-of-hooks */

  if (!enabled) {
    return EMPTY_OBJECT;
  }

  if (className !== undefined) {
    outProps.className = className;
  }

  return outProps;
}

function evaluateRenderProp<T extends React.ElementType, S>(
  element: React.ElementType | undefined,
  render: MUIXUIComponentProps<T, S>['render'],
  props: React.HTMLAttributes<any> & React.RefAttributes<any>,
  state: S,
): React.ReactElement<React.HTMLAttributes<any> & React.RefAttributes<any>> {
  if (render) {
    if (typeof render === 'function') {
      return render(props, state);
    }
    const mergedProps = mergeProps(props, render.props);
    mergedProps.ref = props.ref;
    return React.cloneElement(render, mergedProps);
  }
  if (element) {
    if (typeof element === 'string') {
      return renderTag(element, props);
    }

    return React.createElement(element, props);
  }
  // Unreachable, but the typings on `useRenderElement` need to be reworked
  // to annotate it correctly.
  throw new Error('MUI X: Render element or function are not defined.');
}

function renderTag(Tag: string, props: Record<string, any>) {
  if (Tag === 'button') {
    return <button type="button" {...props} />;
  }
  if (Tag === 'img') {
    return <img alt="" {...props} />;
  }
  return React.createElement(Tag, props);
}

function getChildRef<ElementType extends React.ElementType, State>(
  render: MUIXUIComponentProps<ElementType, State>['render'],
): React.RefCallback<any> | null {
  if (render && typeof render !== 'function') {
    return reactMajor >= 19 ? render.props.ref : render.ref;
  }
  return null;
}

type RenderFunctionProps<TagName> = TagName extends keyof React.JSX.IntrinsicElements
  ? React.JSX.IntrinsicElements[TagName]
  : React.HTMLAttributes<any>;

export namespace useRenderElement {
  export type Parameters<
    State,
    RenderedElementType extends Element,
    TagName,
    Enabled extends boolean | undefined,
  > = {
    /**
     * If `false`, the hook will skip most of its internal logic and return `null`.
     * This is useful for rendering a component conditionally.
     * @default true
     */
    enabled?: Enabled;
    /**
     * @param {HTMLProps} externalProps External props
     * @returns {HTMLProps} props
     * @deprecated
     */
    propGetter?: (externalProps: HTMLProps) => HTMLProps;
    /**
     * The ref to apply to the rendered element.
     */
    ref?: React.Ref<RenderedElementType> | (React.Ref<RenderedElementType> | undefined)[];
    /**
     * The state of the component.
     */
    state?: State;
    /**
     * Intrinsic props to be spread on the rendered element.
     */
    props?:
      | RenderFunctionProps<TagName>
      | Array<
          | RenderFunctionProps<TagName>
          | undefined
          | ((props: RenderFunctionProps<TagName>) => RenderFunctionProps<TagName>)
        >;
    /**
     * A mapping of state to style hooks.
     */
    customStyleHookMapping?: CustomStyleHookMapping<State>;
  } /* This typing ensures `disableStyleHookMapping` is constantly defined or undefined */ & (
    | {
        /**
         * Disable style hook mapping.
         */
        disableStyleHooks: true;
      }
    | {
        /**
         * Disable style hook mapping.
         */
        disableStyleHooks?: false;
      }
  );

  export interface ComponentProps<State> {
    /**
     * The class name to apply to the rendered element.
     * Can be a string or a function that accepts the state and returns a string.
     */
    className?: string | ((state: State) => string);
    /**
     * The render prop or React element to override the default element.
     */
    render?:
      | undefined
      | ComponentRenderFn<React.HTMLAttributes<any>, State>
      | React.ReactElement<Record<string, unknown>>;
  }
}
