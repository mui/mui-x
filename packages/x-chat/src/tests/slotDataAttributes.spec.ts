import type {
  AllTrue,
  Assert,
  AssertAllSlotsAcceptDataAttributes,
} from 'test/utils/slotDataAttributes';
import type {
  ChatBoxSlotProps,
  ChatMessageProps,
  ChatMessageGroupProps,
  ChatMessageListProps,
  ChatMessageSkeletonSlotProps,
  ChatMessageSourceSlotProps,
  ChatMessageSourcesSlotProps,
} from '@mui/x-chat';

// Standalone components expose their slot props only through their `*Props` type.
type ChatMessageSlotProps = NonNullable<ChatMessageProps['slotProps']>;
type ChatMessageGroupSlotProps = NonNullable<ChatMessageGroupProps['slotProps']>;
type ChatMessageListSlotProps = NonNullable<ChatMessageListProps['slotProps']>;

declare module '@mui/utils/types' {
  interface DataAttributesOverrides {
    [key: `data-${string}`]: string | number | boolean | undefined;
  }
}

// Compile-time assertion: every slot a consumer can pass `slotProps` to on an exported
// component must accept `data-*` once `DataAttributesOverrides` is augmented. This includes
// standalone components (`ChatMessage`, `ChatMessageList`, `ChatMessageGroup`) that declare
// their own slot props rather than reusing `ChatBoxSlotProps`.

type AssertChatBox = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<ChatBoxSlotProps, 'ChatBox'>>
>;
type AssertChatMessage = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<ChatMessageSlotProps, 'ChatMessage'>>
>;
type AssertChatMessageList = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<ChatMessageListSlotProps, 'ChatMessageList'>>
>;
type AssertChatMessageGroup = Assert<
  AllTrue<AssertAllSlotsAcceptDataAttributes<ChatMessageGroupSlotProps, 'ChatMessageGroup'>>
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

// Same guard for the standalone `ChatMessage.actions` callback branch.
type ChatMessageActionsCallbackReturn =
  Extract<NonNullable<ChatMessageSlotProps['actions']>, (...args: any[]) => any> extends (
    ...args: any[]
  ) => infer R
    ? R
    : never;
type AssertChatMessageActionsCallback = Assert<
  AllTrue<
    AssertAllSlotsAcceptDataAttributes<
      { return: ChatMessageActionsCallbackReturn },
      'ChatMessage.actions callback'
    >
  >
>;
