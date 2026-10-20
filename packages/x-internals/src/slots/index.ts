import * as React from 'react';

export type PropsFromSlot<
  Slot extends React.JSXElementConstructor<any> | React.ElementType | null | undefined,
> =
  // `JSXElementConstructor` must be checked first: inferring through `ElementType`
  // resolves to `any` for the constructor union used by slot declarations.
  NonNullable<Slot> extends React.JSXElementConstructor<infer P>
    ? P
    : NonNullable<Slot> extends React.ElementType<infer P>
      ? P
      : React.ComponentProps<NonNullable<Slot>>;
