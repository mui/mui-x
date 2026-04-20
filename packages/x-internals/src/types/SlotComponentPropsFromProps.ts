import type * as React from 'react';
import { DataAttributes } from './DataAttributes';

type ResolveSlotProps<T> = T extends React.ElementType ? React.ComponentPropsWithRef<T> : T;

/**
 * Defines the props for a slot component, which can be either partial props
 * with overrides or a function returning such props. Accepts either a props
 * type or an element type as the first generic — when given an element type,
 * its props are derived via `React.ComponentPropsWithRef`.
 *
 * Accepts `data-*` and `aria-*` attributes via a widened variant that adds
 * `DataAttributes`. Kept as a separate union variant (rather than intersected
 * into every variant) so that user code casting to a custom prop type — e.g.
 * `{ editable: true } as CustomLabelProps` — keeps matching the non-widened
 * variant without needing the custom type to declare a `data-*` index
 * signature.
 *
 * @template T - A props type, or a React element type whose props to use.
 * @template TOverrides - Additional props to layer on top.
 * @template TOwnerState - Owner state passed to the function form.
 */
export type SlotComponentPropsFromProps<
  T,
  TOverrides extends {} = {},
  TOwnerState extends {} = {},
> =
  | (Partial<ResolveSlotProps<T>> & TOverrides)
  | (Partial<ResolveSlotProps<T>> & TOverrides & DataAttributes)
  | ((ownerState: TOwnerState) => Partial<ResolveSlotProps<T>> & TOverrides & DataAttributes);
