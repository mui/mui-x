import type {
  AllTrue,
  Assert,
  AssertAllSlotsAcceptDataAttributes,
} from 'test/utils/slotDataAttributes';
import type { SlotComponentPropsFromProps } from '../types/SlotComponentPropsFromProps';

declare module '@mui/utils/types' {
  interface DataAttributesOverrides {
    [key: `data-${string}`]: string | number | boolean | undefined;
  }
}

// `SlotComponentPropsFromProps` is the callback-capable slot type used across charts,
// pickers, and tree view. The per-package assertions accept a slot as long as ONE union arm
// exposes `data-*`, so a regression that widened only the object arm (e.g.
// `WithDataAttributes<T> | ((ownerState) => T)`) would keep every package-wide assertion green.
// Guard the callback RETURN independently, at the source, so that regression is caught.
type ExampleSlot = SlotComponentPropsFromProps<{ example?: number }, {}, {}>;
type CallbackReturn =
  Extract<NonNullable<ExampleSlot>, (...args: any[]) => any> extends (...args: any[]) => infer R
    ? R
    : never;
type AssertSlotComponentPropsFromPropsCallback = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<
      { return: CallbackReturn },
      'SlotComponentPropsFromProps callback'
    >
  >
>;
