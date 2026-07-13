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

// Compile-time assertion: every slot in every exported SlotProps type of `x-chat`
// must accept `data-*` attributes once `DataAttributesOverrides` is augmented (below).

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
