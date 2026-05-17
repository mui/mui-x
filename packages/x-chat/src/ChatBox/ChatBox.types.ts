import * as React from 'react';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import { SlotComponentProps } from '@mui/utils/types';
import {
  type ChatRootProps,
  type MessageListRootAutoScrollConfig,
  type ChatSuggestion,
  type ChatVariant,
  type ChatDensity,
  type ChatAttachmentsConfig,
} from '@mui/x-chat-headless';
import type { ChatConversationProps } from '../ChatConversation/ChatConversation';
import type { ChatConversationListProps } from '../ChatConversationList/ChatConversationList';
import type { ChatConversationHeaderProps } from '../ChatConversation/ChatConversationHeader';
import type { ChatConversationTitleProps } from '../ChatConversation/ChatConversationTitle';
import type { ChatConversationSubtitleProps } from '../ChatConversation/ChatConversationSubtitle';
import type { ChatConversationHeaderInfoProps } from '../ChatConversation/ChatConversationHeaderInfo';
import type { ChatConversationHeaderActionsProps } from '../ChatConversation/ChatConversationHeaderActions';
import type { ChatMessageListProps } from '../ChatMessageList/ChatMessageList';
import type { ChatMessageProps } from '../ChatMessage/ChatMessage';
import type { ChatMessageAvatarProps } from '../ChatMessage/ChatMessageAvatar';
import type { ChatMessageContentProps } from '../ChatMessage/ChatMessageContent';
import type { ChatMessageMetaProps } from '../ChatMessage/ChatMessageMeta';
import type { ChatMessageActionsProps } from '../ChatMessage/ChatMessageActions';
import type { ChatMessageGroupProps } from '../ChatMessage/ChatMessageGroup';
import type { ChatMessageErrorProps } from '../ChatMessageError/ChatMessageError';
import type { ChatDateDividerProps } from '../ChatMessage/ChatDateDivider';
import type { ChatComposerProps } from '../ChatComposer/ChatComposer';
import type { ChatComposerTextAreaProps } from '../ChatComposer/ChatComposerTextArea';
import type { ChatComposerSendButtonProps } from '../ChatComposer/ChatComposerSendButton';
import type { ChatComposerAttachButtonProps } from '../ChatComposer/ChatComposerAttachButton';
import type { ChatComposerAttachmentListProps } from '../ChatComposer/ChatComposerAttachmentList';
import type { ChatComposerToolbarProps } from '../ChatComposer/ChatComposerToolbar';
import type { ChatComposerHelperTextProps } from '../ChatComposer/ChatComposerHelperText';
import type { ChatTypingIndicatorProps } from '../ChatIndicators/ChatTypingIndicator';
import type { ChatUnreadMarkerProps } from '../ChatIndicators/ChatUnreadMarker';
import type { ChatScrollToBottomAffordanceProps } from '../ChatIndicators/ChatScrollToBottomAffordance';
import type { ChatSuggestionsProps } from '../ChatSuggestions/ChatSuggestions';
import { type ChatBoxClasses } from './chatBoxClasses';

/**
 * Slot map for the `conversation` family.
 *
 * `root` swaps the styled element of `<ChatConversation>` (wrapper-only); the
 * default child layout (header + message list + composer) continues to render
 * inside it. The other keys override individual conversation sub-components.
 */
export interface ChatBoxConversationSlots {
  root?: React.ElementType;
  list?: React.ElementType;
  header?: React.ElementType;
  title?: React.ElementType;
  subtitle?: React.ElementType;
  headerInfo?: React.ElementType;
  headerActions?: React.ElementType;
}

export interface ChatBoxConversationSlotProps {
  root?: Partial<ChatConversationProps>;
  list?: Partial<ChatConversationListProps>;
  header?: Partial<ChatConversationHeaderProps>;
  title?: Partial<ChatConversationTitleProps>;
  subtitle?: Partial<ChatConversationSubtitleProps>;
  headerInfo?: Partial<ChatConversationHeaderInfoProps>;
  headerActions?: Partial<ChatConversationHeaderActionsProps>;
}

/**
 * Slot map for the `messagesList` family — list-level chrome.
 *
 * `root` swaps the styled element of `<ChatMessageList>` (wrapper-only).
 * `group` overrides the per-message group wrapper component.
 */
export interface ChatBoxMessagesListSlots {
  root?: React.ElementType;
  group?: React.ElementType;
  dateDivider?: React.ElementType;
  unreadMarker?: React.ElementType;
}

export interface ChatBoxMessagesListSlotProps {
  root?: Partial<ChatMessageListProps>;
  group?: Partial<ChatMessageGroupProps>;
  dateDivider?: Partial<ChatDateDividerProps>;
  unreadMarker?: Partial<ChatUnreadMarkerProps>;
}

/**
 * Slot map for the `message` family — one row's parts.
 *
 * `root` swaps the styled element of `<ChatMessage>` (wrapper-only).
 * Presentational sub-slots accept `null` to hide the piece and collapse the
 * surrounding layout (avatar grid track, etc.).
 */
export interface ChatBoxMessageSlots {
  root?: React.ElementType;
  /**
   * Avatar component. Pass `null` to hide the avatar entirely and drop the
   * reserved avatar grid track.
   */
  avatar?: React.ElementType | null;
  content?: React.ElementType;
  /**
   * External meta (compact variant). Pass `null` to hide.
   */
  meta?: React.ElementType | null;
  /**
   * Inline meta rendered inside the bubble (default variant). Pass `null` to
   * hide.
   */
  inlineMeta?: React.ElementType | null;
  /** Error card shown under the bubble when the message status is `error`. */
  error?: React.ElementType;
  /**
   * Actions row component (receives `{ messageId }`). Pass `null` (or omit) to
   * hide actions.
   */
  actions?: React.ElementType | null;
  /**
   * Author name label rendered by the group wrapper (default variant: above
   * the bubble; compact variant: inside the message grid). Pass `null` to
   * hide.
   */
  authorName?: React.ElementType | null;
}

export interface ChatBoxMessageSlotProps {
  root?: Partial<ChatMessageProps>;
  avatar?: Partial<ChatMessageAvatarProps>;
  content?: Partial<ChatMessageContentProps>;
  meta?: Partial<ChatMessageMetaProps>;
  inlineMeta?: Record<string, unknown>;
  error?: Partial<ChatMessageErrorProps>;
  actions?: Partial<ChatMessageActionsProps>;
  authorName?: Record<string, unknown>;
}

/**
 * Slot map for the `composer` family.
 *
 * `root` swaps the styled element of `<ChatComposer>` (wrapper-only); attach,
 * input, send, toolbar, attachmentList, and helperText continue to render
 * inside it via the default composer layout.
 */
export interface ChatBoxComposerSlots {
  root?: React.ElementType;
  input?: React.ElementType;
  /**
   * Send button. Pass `null` to hide it; form still submits on Enter.
   */
  send?: React.ElementType | null;
  /**
   * Attach button. Pass `null` to hide just the button while keeping the rest
   * of the attachment pipeline (drag/drop, paste). Use `features.attachments:
   * false` to disable attachments entirely.
   */
  attach?: React.ElementType | null;
  attachmentList?: React.ElementType;
  toolbar?: React.ElementType;
  helperText?: React.ElementType;
}

export interface ChatBoxComposerSlotProps {
  root?: Partial<ChatComposerProps>;
  input?: Partial<ChatComposerTextAreaProps>;
  send?: Partial<ChatComposerSendButtonProps>;
  attach?: Partial<ChatComposerAttachButtonProps>;
  attachmentList?: Partial<ChatComposerAttachmentListProps>;
  toolbar?: Partial<ChatComposerToolbarProps>;
  helperText?: Partial<ChatComposerHelperTextProps>;
}

export interface ChatBoxSlots {
  // Outer layout (singletons, flat)
  root?: React.ElementType;
  layout?: React.ElementType;
  conversationsPane?: React.ElementType;
  threadPane?: React.ElementType;

  // Nested families
  conversation?: ChatBoxConversationSlots;
  messagesList?: ChatBoxMessagesListSlots;
  message?: ChatBoxMessageSlots;
  composer?: ChatBoxComposerSlots;

  // Standalone widgets
  typingIndicator?: React.ElementType;
  scrollToBottom?: React.ElementType;
  suggestions?: React.ElementType;
  emptyState?: React.ElementType;
}

export interface ChatBoxSlotProps {
  root?: SlotComponentProps<'div', { sx?: SxProps<Theme> }, {}>;
  layout?: SlotComponentProps<'div', { sx?: SxProps<Theme> }, {}>;
  conversationsPane?: SlotComponentProps<'div', { sx?: SxProps<Theme> }, {}>;
  threadPane?: SlotComponentProps<'div', { sx?: SxProps<Theme> }, {}>;

  conversation?: ChatBoxConversationSlotProps;
  messagesList?: ChatBoxMessagesListSlotProps;
  message?: ChatBoxMessageSlotProps;
  composer?: ChatBoxComposerSlotProps;

  typingIndicator?: Partial<ChatTypingIndicatorProps>;
  scrollToBottom?: Partial<ChatScrollToBottomAffordanceProps>;
  suggestions?: Partial<ChatSuggestionsProps>;
  emptyState?: SlotComponentProps<'div', { sx?: SxProps<Theme> }, {}>;
}

export interface ChatBoxFeatures {
  /**
   * Whether to render the built-in conversation list sidebar / drawer.
   * When disabled, `ChatBox` renders only the active thread surface even if
   * conversations are present or loaded through `adapter.listConversations()`.
   * This flag controls only the built-in sidebar / drawer UI.
   * @default false
   */
  conversationList?: boolean;
  /**
   * Whether to show the scroll-to-bottom affordance button when the user has scrolled up.
   * @default true
   */
  scrollToBottom?: boolean;
  /**
   * Whether to show the conversation header (title, subtitle, and actions bar).
   * @default true
   */
  conversationHeader?: boolean;
  /**
   * Whether to enable attachment functionality (attach button and attachment preview list),
   * and optionally configure attachment validation constraints.
   *
   * - `true` – enable with no restrictions (default).
   * - `false` – disable attachment functionality entirely.
   * - `{ acceptedMimeTypes, maxFileCount, maxFileSize, onAttachmentReject }` – enable
   *   with the specified validation rules.
   * @default true
   */
  attachments?: boolean | ChatAttachmentsConfig;
  /**
   * Whether to show the helper text below the composer input.
   * @default true
   */
  helperText?: boolean;
  /**
   * Controls automatic scrolling to the bottom when new messages arrive or streaming
   * content grows, as long as the user is within `buffer` pixels of the bottom.
   *
   * - `true` – enable with the default buffer (150 px).
   * - `{ buffer: number }` – enable with a custom threshold.
   * - `false` – disable all automatic scrolling (the user can still use the
   *   scroll-to-bottom affordance button manually).
   *
   * Note: scrolling to the bottom when the *user* sends a message is always
   * active regardless of this setting.
   * @default true
   */
  autoScroll?: boolean | MessageListRootAutoScrollConfig;
  /**
   * Whether to show prompt suggestions in the empty state.
   * @default true
   */
  suggestions?: boolean;
}

export type ChatBoxLayoutMode = 'standard' | 'overlay' | 'split';

export interface ChatBoxLayoutModeBreakpoints {
  /**
   * Container width below which ChatBox switches from the standard side-by-side layout
   * to the overlay conversations panel.
   * @default 600
   */
  overlay: number;
  /**
   * Container width below which ChatBox switches from overlay mode to the split list/thread flow.
   * This value is clamped so it never exceeds `overlay`.
   * @default 450
   */
  split: number;
}

export interface ChatBoxProps<Cursor = string> extends Omit<
  ChatRootProps<Cursor>,
  'slots' | 'slotProps'
> {
  className?: string;
  sx?: SxProps<Theme>;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ChatBoxClasses>;
  /**
   * The visual layout variant of the chat.
   * - `'default'` – Standard layout with avatars, individual timestamps, and full spacing.
   * - `'compact'` – Messenger-style layout: no avatars, author + timestamp in group header, tighter spacing.
   * @default 'default'
   */
  variant?: ChatVariant;
  /**
   * The vertical spacing density of chat messages.
   * - `'compact'` – Reduced vertical spacing between messages.
   * - `'standard'` – Default spacing.
   * - `'comfortable'` – Increased vertical spacing between messages.
   * @default 'standard'
   */
  density?: ChatDensity;
  /**
   * The components used for each slot inside the ChatBox, organised by family.
   *
   * - `conversation.*` — the conversation wrapper, list, header, title, subtitle, header info, header actions.
   * - `messagesList.*` — the list scroller, group wrapper, date divider, unread marker.
   * - `message.*` — per-row parts (root, avatar, content, meta, inlineMeta, error, actions, authorName).
   *   Pass `null` to a presentational slot (`avatar`, `meta`, `inlineMeta`, `actions`, `authorName`) to hide it and collapse the surrounding layout.
   * - `composer.*` — root, input, send, attach, attachmentList, toolbar, helperText.
   *   Pass `null` to `send` / `attach` to hide the button.
   * - Standalone slots (`typingIndicator`, `scrollToBottom`, `suggestions`, `emptyState`, layout pieces) stay flat at the top level.
   */
  slots?: ChatBoxSlots;
  /**
   * Props forwarded to each slot. Mirrors the structure of `slots`.
   */
  slotProps?: ChatBoxSlotProps;
  /**
   * Feature flags to enable or disable built-in ChatBox behaviours.
   */
  features?: ChatBoxFeatures;
  /**
   * Forces the responsive layout mode instead of deriving it from the container width.
   * When omitted, ChatBox chooses the mode automatically using `layoutModeBreakpoints`.
   */
  layoutMode?: ChatBoxLayoutMode;
  /**
   * Container-width breakpoints used when `layoutMode` is not provided.
   */
  layoutModeBreakpoints?: Partial<ChatBoxLayoutModeBreakpoints>;
  /**
   * Prompt suggestions displayed in the empty state.
   * Clicking a suggestion pre-fills the composer.
   */
  suggestions?: Array<ChatSuggestion | string>;
  /**
   * Whether clicking a suggestion automatically submits the message.
   * @default false
   */
  suggestionsAutoSubmit?: boolean;
}
