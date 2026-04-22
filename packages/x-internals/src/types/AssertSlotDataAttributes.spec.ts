import {
  SlotComponentPropsFromProps,
  AssertAllSlotsAcceptDataAttributes,
  AllTrue,
  Assert,
} from './index';

// A typical slot-props interface using the helper — every slot must accept data-*.
interface GoodSlotProps {
  day?: SlotComponentPropsFromProps<{ onClick?: () => void }>;
  calendarHeader?: SlotComponentPropsFromProps<'div'>;
}

type AssertGoodSlotProps = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<GoodSlotProps, 'Good'>>
>;

// Sanity: a slot that does NOT use the helper must fail. The `@ts-expect-error` below is
// the test — if `AssertAllSlotsAcceptDataAttributes` stops catching bad slots, the
// directive becomes unused and TypeScript surfaces it as an error.
interface BadSlotProps {
  legacy?: { required: string };
}

// @ts-expect-error FAIL [Bad.legacy]: slot must accept data-* attributes. Use SlotComponentPropsFromProps.
type AssertBadSlotProps = Assert<AllTrue<AssertAllSlotsAcceptDataAttributes<BadSlotProps, 'Bad'>>>;
