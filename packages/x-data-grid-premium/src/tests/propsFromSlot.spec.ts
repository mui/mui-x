import type { GridSlots, PropsFromSlot } from '@mui/x-data-grid-premium';
import type { Expect, Equal } from 'test/utils/typeUtils';

type IsAny<T> = 0 extends 1 & T ? true : false;

// Every slot of every plan must give typed props, not `any`.
type AnySlots = {
  [K in keyof GridSlots]-?: IsAny<PropsFromSlot<GridSlots[K]>> extends true ? K : never;
}[keyof GridSlots];

type NoAnySlots = Expect<Equal<AnySlots, never>>;
