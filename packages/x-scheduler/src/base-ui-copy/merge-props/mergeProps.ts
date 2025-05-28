import * as React from 'react';
import { mergeObjects } from '../utils/mergeObjects';
import type { BaseUIEvent, WithBaseUIEvent } from '../utils/types';

type ElementType = React.ElementType;
type PropsOf<T extends React.ElementType> = WithBaseUIEvent<React.ComponentPropsWithRef<T>>;
type InputProps<T extends React.ElementType> =
  | PropsOf<T>
  | ((otherProps: PropsOf<T>) => PropsOf<T>)
  | undefined;

const EMPTY_PROPS = {};

/**
 * Merges multiple sets of React props. It follows the Object.assign pattern where the rightmost object's fields overwrite
 * the conflicting ones from others. This doesn't apply to event handlers, `className` and `style` props.
 * Event handlers are merged such that they are called in sequence (the rightmost one being called first),
 * and allows the user to prevent the subsequent event handlers from being
 * executed by attaching a `preventBaseUIHandler` method.
 * It also merges the `className` and `style` props, whereby the classes are concatenated
 * and the rightmost styles overwrite the subsequent ones.
 *
 * Props can either be provided as objects or as functions that take the previous props as an argument.
 * The function will receive the merged props up to that point (going from left to right):
 * so in the case of `(obj1, obj2, fn, obj3)`, `fn` will receive the merged props of `obj1` and `obj2`.
 * The function is responsible for chaining event handlers if needed (i.e. we don't run the merge logic).
 *
 * Event handlers returned by the functions are not automatically prevented when `preventBaseUIHandler` is called.
 * They must check `event.baseUIHandlerPrevented` themselves and bail out if it's true.
 *
 * @important **`ref` is not merged.**
 * @param props props to merge.
 * @returns the merged props.
 */
/* eslint-disable id-denylist */
export function mergeProps<T extends ElementType>(a: InputProps<T>, b: InputProps<T>): PropsOf<T>;
export function mergeProps<T extends ElementType>(a: InputProps<T>, b: InputProps<T>): PropsOf<T>;
export function mergeProps<T extends ElementType>(
  a: InputProps<T>,
  b: InputProps<T>,
  c: InputProps<T>,
): PropsOf<T>;
export function mergeProps<T extends ElementType>(
  a: InputProps<T>,
  b: InputProps<T>,
  c: InputProps<T>,
  d: InputProps<T>,
): PropsOf<T>;
export function mergeProps<T extends ElementType>(
  a: InputProps<T>,
  b: InputProps<T>,
  c: InputProps<T>,
  d: InputProps<T>,
  e: InputProps<T>,
): PropsOf<T>;
export function mergeProps(a: any, b: any, c?: any, d?: any, e?: any) {
  // We need to mutably own `merged`
  let merged = { ...resolvePropsGetter(a, EMPTY_PROPS) };

  if (b) {
    merged = mergeOne(merged, b);
  }
  if (c) {
    merged = mergeOne(merged, c);
  }
  if (d) {
    merged = mergeOne(merged, d);
  }
  if (e) {
    merged = mergeOne(merged, e);
  }

  return merged;
}
/* eslint-enable id-denylist */

export function mergePropsN<T extends ElementType>(props: InputProps<T>[]): PropsOf<T> {
  if (props.length === 0) {
    return EMPTY_PROPS as PropsOf<T>;
  }
  if (props.length === 1) {
    return resolvePropsGetter(props[0], EMPTY_PROPS);
  }

  // We need to mutably own `merged`
  let merged = { ...resolvePropsGetter(props[0], EMPTY_PROPS) };

  for (let i = 1; i < props.length; i += 1) {
    merged = mergeOne(merged, props[i]);
  }

  return merged as PropsOf<T>;
}

function mergeOne<T extends ElementType>(merged: Record<string, any>, inputProps: InputProps<T>) {
  if (isPropsGetter(inputProps)) {
    return inputProps(merged);
  }
  return mutablyMergeInto(merged, inputProps);
}

/**
 * Merges two sets of props. In case of conflicts, the external props take precedence.
 */
function mutablyMergeInto<T extends ElementType>(
  mergedProps: Record<string, any>,
  externalProps: React.ComponentPropsWithRef<T> | undefined,
) {
  if (!externalProps) {
    return mergedProps;
  }

  // eslint-disable-next-line guard-for-in
  for (const propName in externalProps) {
    const externalPropValue = externalProps[propName];

    switch (propName) {
      case 'style': {
        mergedProps[propName] = mergeObjects(
          mergedProps.style as React.CSSProperties | undefined,
          externalPropValue as React.CSSProperties | undefined,
        );
        break;
      }
      case 'className': {
        mergedProps[propName] = mergeClassNames(mergedProps.className, externalPropValue as string);
        break;
      }
      default: {
        if (isEventHandler(propName, externalPropValue)) {
          mergedProps[propName] = mergeEventHandlers(mergedProps[propName], externalPropValue);
        } else {
          mergedProps[propName] = externalPropValue;
        }
      }
    }
  }

  return mergedProps;
}

function isEventHandler(key: string, value: unknown) {
  // This approach is more efficient than using a regex.
  const code0 = key.charCodeAt(0);
  const code1 = key.charCodeAt(1);
  const code2 = key.charCodeAt(2);
  return (
    code0 === 111 /* o */ &&
    code1 === 110 /* n */ &&
    code2 >= 65 /* A */ &&
    code2 <= 90 /* Z */ &&
    typeof value === 'function'
  );
}

function isPropsGetter<T extends React.ComponentType>(
  inputProps: InputProps<T>,
): inputProps is (props: PropsOf<T>) => PropsOf<T> {
  return typeof inputProps === 'function';
}

function resolvePropsGetter<T extends ElementType>(
  inputProps: InputProps<ElementType>,
  previousProps: PropsOf<T>,
) {
  if (isPropsGetter(inputProps)) {
    return inputProps(previousProps);
  }

  return inputProps ?? (EMPTY_PROPS as PropsOf<T>);
}

function mergeEventHandlers(ourHandler: Function, theirHandler: Function) {
  return (event: unknown) => {
    if (isSyntheticEvent(event)) {
      const baseUIEvent = event as BaseUIEvent<typeof event>;

      makeEventPreventable(baseUIEvent);

      const result = theirHandler(baseUIEvent);

      if (!baseUIEvent.baseUIHandlerPrevented) {
        ourHandler?.(baseUIEvent);
      }

      return result;
    }

    const result = theirHandler(event);
    ourHandler?.(event);
    return result;
  };
}

export function makeEventPreventable<T extends React.SyntheticEvent>(event: BaseUIEvent<T>) {
  event.preventBaseUIHandler = () => {
    (event.baseUIHandlerPrevented as boolean) = true;
  };

  return event;
}

function mergeClassNames(ourClassName: string | undefined, theirClassName: string | undefined) {
  if (theirClassName) {
    if (ourClassName) {
      // eslint-disable-next-line prefer-template
      return theirClassName + ' ' + ourClassName;
    }

    return theirClassName;
  }

  return ourClassName;
}

function isSyntheticEvent(event: unknown): event is React.SyntheticEvent {
  return event != null && typeof event === 'object' && 'nativeEvent' in event;
}
