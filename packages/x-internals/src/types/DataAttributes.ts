import type * as React from 'react';

type DataAttributeValue = string | number | boolean | undefined;

/**
 * Module-augmentable interface that lets consumers declare strongly-typed
 * custom `data-*` keys, which become part of `DataAttributes` everywhere slot
 * props accept it. Example:
 *
 *     declare module '@mui/x-internals/types' {
 *       interface DataAttributesOverrides {
 *         'data-qa-id'?: string;
 *       }
 *     }
 */
export interface DataAttributesOverrides {}

/**
 * Union of all `data-*` and `aria-*` attributes accepted on slot props.
 * `aria-*` keys reuse React's typed `AriaAttributes` so standard keys keep
 * their value constraints (e.g. `aria-expanded: boolean | 'true' | 'false'`).
 */
export type DataAttributes = React.AriaAttributes &
  DataAttributesOverrides & {
    [k: `data-${string}`]: DataAttributeValue;
  };

/**
 * Widens a slot-props type to also accept `data-*` and `aria-*` attributes.
 *
 * Implemented as a union between the original type and the intersected widened
 * form — `T | (T & DataAttributes)` — so that pre-typed values remain
 * assignable to the original branch without having to declare a `data-*`
 * index signature themselves, while object literals can pick up the widened
 * branch and include `data-*` / `aria-*` keys.
 */
export type WithDataAttributes<T> = T | (T & DataAttributes);
