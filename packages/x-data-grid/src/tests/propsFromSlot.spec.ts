import type { GridSlots } from '@mui/x-data-grid';
import type { Expect, Equal } from 'test/utils/typeUtils';
import type { GridSlotProps, PropsFromSlot } from '../models';

// `PropsFromSlot` must recover the props each slot was declared with. Slots typed as
// `React.JSXElementConstructor` used to resolve to `any`.
type Toolbar = Expect<Equal<PropsFromSlot<GridSlots['toolbar']>, GridSlotProps['toolbar']>>;
type Footer = Expect<Equal<PropsFromSlot<GridSlots['footer']>, GridSlotProps['footer']>>;
