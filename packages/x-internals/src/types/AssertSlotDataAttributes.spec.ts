import {
  SlotComponentPropsFromProps,
  AssertAllSlotsAcceptDataAttributes,
  AllTrue,
  Assert,
} from './index';

// A typical slot-props interface using the helper — every slot must accept data-*/aria-*.
interface GoodSlotProps {
  day?: SlotComponentPropsFromProps<{ onClick?: () => void }>;
  calendarHeader?: SlotComponentPropsFromProps<'div'>;
}

type AssertGoodSlotProps = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<GoodSlotProps, 'Good'>>
>;

// Sanity: a slot that does NOT use the helper should fail. The assertion below is commented
// out because we only want the successful case in the emitted test. Uncomment locally to
// verify the helper surfaces the expected failure message.
//
// interface BadSlotProps { legacy?: { required: string } }
// type AssertBadSlotProps = Assert<AllTrue<AssertAllSlotsAcceptDataAttributes<BadSlotProps, 'Bad'>>>;
//                      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Error: Type "FAIL [Bad.legacy]: slot must accept data-* and aria-* attributes. ..." is not
// assignable to type `true`.
