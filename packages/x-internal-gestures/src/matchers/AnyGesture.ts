import { Gesture } from '../core';

export type AnyGesture = new <T extends { name: N }, N extends string = string>(
  options: T,
  ...args: any[]
) => Gesture<N>;
