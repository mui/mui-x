import type { AllTrue, Assert, AssertAllSlotsAcceptDataAttributes } from '@mui/x-internals/types';
import type {
  ChatBoxSlotProps,
  ChatMessageSkeletonSlotProps,
  ChatMessageSourceSlotProps,
  ChatMessageSourcesSlotProps,
} from '@mui/x-chat';

// Compile-time assertion: every slot in every exported SlotProps type of `x-chat`
// must accept `data-*` and `aria-*` attributes. The test compiles iff the assertion holds.

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
