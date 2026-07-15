import type {
  AllTrue,
  Assert,
  AssertAllSlotsAcceptDataAttributes,
} from 'test/utils/slotDataAttributes';
import type {
  ChatBoxSlotProps,
  ChatMessageSkeletonSlotProps,
  ChatMessageSourceSlotProps,
  ChatMessageSourcesSlotProps,
} from '@mui/x-chat';

declare module '@mui/utils/types' {
  interface DataAttributesOverrides {
    [key: `data-${string}`]: string | number | boolean | undefined;
  }
}

// Compile-time assertion: every slot of every exported top-level component and provider
// `*SlotProps` in `x-chat` must accept `data-*` once `DataAttributesOverrides` is augmented,
// so a regression names the offending slot. Slots of nested components (plot elements,
// `use*` hooks) are exercised through their parent's `*SlotProps`.

type AssertChatBox = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<ChatBoxSlotProps, 'ChatBox'>>
>;
type AssertChatMessageSkeleton = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<ChatMessageSkeletonSlotProps, 'ChatMessageSkeleton'>>
>;
type AssertChatMessageSource = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<ChatMessageSourceSlotProps, 'ChatMessageSource'>>
>;
type AssertChatMessageSources = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<ChatMessageSourcesSlotProps, 'ChatMessageSources'>>
>;

// `messageActions` is the only callback-form ChatBox slot. Assert the callback
// RETURN accepts `data-*` on its own: the whole `AssertChatBox` check would still
// pass if only the object branch were widened, so this guards against wrapping the
// whole object-or-callback union (which leaves the callback return unwidened).
type MessageActionsCallbackReturn =
  Extract<NonNullable<ChatBoxSlotProps['messageActions']>, (...args: any[]) => any> extends (
    ...args: any[]
  ) => infer R
    ? R
    : never;
type AssertMessageActionsCallback = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<
      { return: MessageActionsCallbackReturn },
      'ChatBox.messageActions callback'
    >
  >
>;
