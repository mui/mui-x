import * as React from 'react';

export type PropsFromSlot<Slot extends React.JSXElementConstructor<any> | undefined> =
  React.ComponentProps<NonNullable<Slot>>;
