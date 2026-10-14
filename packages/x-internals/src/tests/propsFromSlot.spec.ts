import type { Expect, Equal } from 'test/utils/typeUtils';
import type { PropsFromSlot } from '../slots';

interface SlotProps {
  label: string;
  count?: number;
}

// Slots are declared as `React.JSXElementConstructor` (for example in the Data Grid and
// the charts). Inferring their props through `React.ElementType` resolves to `any`,
// so `PropsFromSlot` must unwrap the constructor first.
type ConstructorSlot = Expect<
  Equal<PropsFromSlot<React.JSXElementConstructor<SlotProps>>, SlotProps>
>;
type FunctionSlot = Expect<Equal<PropsFromSlot<React.FC<SlotProps>>, SlotProps>>;
type ElementTypeSlot = Expect<Equal<PropsFromSlot<React.ElementType<SlotProps>>, SlotProps>>;
type IntrinsicSlot = Expect<Equal<PropsFromSlot<'button'>, React.ComponentProps<'button'>>>;
