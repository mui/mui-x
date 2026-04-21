import type * as React from 'react';
import { WithDataAttributes } from './DataAttributes';

type ResolveSlotProps<T> = T extends React.ElementType ? React.ComponentPropsWithRef<T> : T;

/**
 * Defines the props for a slot component, which can be either partial props
 * with overrides or a function returning such props. Accepts either a props
 * type or an element type as the first generic — when given an element type,
 * its props are derived via `React.ComponentPropsWithRef`.
 *
 * Both the object and function forms are widened via `WithDataAttributes`,
 * which keeps the original type as one branch of a union so that user code
 * casting to a custom prop type — e.g. `{ editable: true } as CustomLabelProps`
 * or `return customProps as CustomLabelProps` from the callback — stays
 * assignable without needing the custom type to declare a `data-*` index
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
  | WithDataAttributes<Partial<ResolveSlotProps<T>> & TOverrides>
  | ((ownerState: TOwnerState) => WithDataAttributes<Partial<ResolveSlotProps<T>> & TOverrides>);
