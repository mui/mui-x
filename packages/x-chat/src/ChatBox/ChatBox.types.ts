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

// ---------------------------------------------------------------------------
// ChatBox slots use a FLAT, prefixed vocabulary (like `GridSlotsComponent`).
// The interfaces below are an authoring detail composed into `ChatBoxSlots` /
// `ChatBoxSlotProps`; only the composed types are exported as the public API.
//
// Two vocabularies exist in x-chat:
//   - Flat prefixed (here): the message-rendering pipeline — `ChatBox`,
//     `ChatMessageList`, `ChatMessageGroup`.
//   - Short local: the leaf styled components — `ChatMessage`, `ChatComposer`,
//     `ChatConversation`, and conversation-list/header parts.
// The flat→short translation happens at the single seam where the pipeline
// renders a leaf.
// ---------------------------------------------------------------------------

/** Outer layout singletons. */
interface ChatBoxLayoutSlots {
  /** The outermost `ChatBox` container element. */
  root?: React.ElementType;
  /** Wrapper that arranges the conversations pane and the thread pane. */
  layout?: React.ElementType;
  /** Container for the conversation-list sidebar (or drawer on narrow widths). */
  conversationsPane?: React.ElementType;
  /** Container for the active thread — the message list plus the composer. */
  threadPane?: React.ElementType;
}

interface ChatBoxLayoutSlotProps {
  root?: SlotComponentProps<'div', { sx?: SxProps<Theme> }, {}>;
  layout?: SlotComponentProps<'div', { sx?: SxProps<Theme> }, {}>;
  conversationsPane?: SlotComponentProps<'div', { sx?: SxProps<Theme> }, {}>;
  threadPane?: SlotComponentProps<'div', { sx?: SxProps<Theme> }, {}>;
}

/**
 * Conversation family. `conversationRoot` swaps the styled element of
 * `<ChatConversation>` (wrapper-only); the default child layout (header +
 * message list + composer) continues to render inside it.
 */
interface ChatBoxConversationSlots {
  /**
   * Styled root of `<ChatConversation>` (wrapper-only); the default header,
   * message list and composer continue to render inside it.
   */
  conversationRoot?: React.ElementType;
  /** The conversation-list sidebar component. */
  conversationList?: React.ElementType;
  /** The header bar rendered above the message list. */
  conversationHeader?: React.ElementType;
  /** The title + subtitle group inside the header. */
  conversationHeaderInfo?: React.ElementType;
  /** The conversation title element. */
  conversationTitle?: React.ElementType;
  /** The conversation subtitle element (participants, status, etc.). */
  conversationSubtitle?: React.ElementType;
  /** The actions area on the trailing side of the header. */
  conversationHeaderActions?: React.ElementType;
}

interface ChatBoxConversationSlotProps {
  conversationRoot?: Partial<ChatConversationProps>;
  conversationList?: Partial<ChatConversationListProps>;
  conversationHeader?: Partial<ChatConversationHeaderProps>;
  conversationHeaderInfo?: Partial<ChatConversationHeaderInfoProps>;
  conversationTitle?: Partial<ChatConversationTitleProps>;
  conversationSubtitle?: Partial<ChatConversationSubtitleProps>;
  conversationHeaderActions?: Partial<ChatConversationHeaderActionsProps>;
}

/**
 * Message-list chrome. `messageList` swaps the whole `<ChatMessageList>`
 * (wrapper-only); `messageGroup` swaps the per-author group wrapper.
 */
interface ChatBoxMessageListSlots {
  /** Styled root of the scrollable `<ChatMessageList>` (wrapper-only). */
  messageList?: React.ElementType;
  /** The per-author group wrapper around consecutive messages. */
  messageGroup?: React.ElementType;
  /** The date separator rendered between message groups. Pass `null` to hide it. */
  dateDivider?: React.ElementType | null;
  /** The "new messages" marker. Pass `null` to hide it. */
  unreadMarker?: React.ElementType | null;
}

interface ChatBoxMessageListSlotProps {
  messageList?: Partial<ChatMessageListProps>;
  messageGroup?: Partial<ChatMessageGroupProps>;
  dateDivider?: Partial<ChatDateDividerProps>;
  unreadMarker?: Partial<ChatUnreadMarkerProps>;
}

/**
 * Per-row message parts. `messageRoot` swaps the styled element of
 * `<ChatMessage>` (wrapper-only). Presentational slots accept `null` to hide the
 * piece and collapse the surrounding layout (avatar grid track, etc.).
 */
interface ChatBoxMessageSlots {
  /**
   * Styled root of `<ChatMessage>` (wrapper-only); the default avatar/content/meta
   * tree still renders inside it.
   */
  messageRoot?: React.ElementType;
  /**
   * Avatar component. Pass `null` to hide the avatar entirely and drop the
   * reserved avatar grid track.
   */
  messageAvatar?: React.ElementType | null;
  /** The message bubble component. */
  messageContent?: React.ElementType;
  /** External meta (compact variant). Pass `null` to hide. */
  messageMeta?: React.ElementType | null;
  /** Inline meta rendered inside the bubble (default variant). Pass `null` to hide. */
  messageInlineMeta?: React.ElementType | null;
  /** Error card shown under the bubble when the message status is `error`. */
  messageError?: React.ElementType;
  /**
   * Actions row component (receives `{ messageId }`). Pass `null` (or omit) to
   * hide actions.
   */
  messageActions?: React.ElementType | null;
  /**
   * Author name label rendered by the group wrapper (default variant: above the
   * bubble; compact variant: inside the message grid). Pass `null` to hide.
   */
  messageAuthorName?: React.ElementType | null;
}

interface ChatBoxMessageSlotProps {
  messageRoot?: Partial<ChatMessageProps>;
  messageAvatar?: Partial<ChatMessageAvatarProps>;
  messageContent?: Partial<ChatMessageContentProps>;
  messageMeta?: Partial<ChatMessageMetaProps>;
  messageInlineMeta?: Record<string, unknown>;
  messageError?: Partial<ChatMessageErrorProps>;
  messageActions?: Partial<ChatMessageActionsProps>;
  messageAuthorName?: Record<string, unknown>;
}

/**
 * Composer family. `composerRoot` swaps the styled element of `<ChatComposer>`
 * (wrapper-only); the default attach/input/send/toolbar render inside it.
 */
interface ChatBoxComposerSlots {
  /**
   * Styled root of `<ChatComposer>` (wrapper-only); the default attach/input/send/
   * toolbar render inside it.
   */
  composerRoot?: React.ElementType;
  /** The auto-resizing text input. */
  composerInput?: React.ElementType;
  /** Send button. Pass `null` to hide it; the form still submits on Enter. */
  composerSendButton?: React.ElementType | null;
  /**
   * Attach button. Pass `null` to hide just the button while keeping the rest of
   * the attachment pipeline (drag/drop, paste). Use `features.attachments: false`
   * to disable attachments entirely.
   */
  composerAttachButton?: React.ElementType | null;
  /** The pending-attachment preview list. */
  composerAttachmentList?: React.ElementType;
  /** The composer toolbar (button row). */
  composerToolbar?: React.ElementType;
  /** The helper / disclaimer text below the input. */
  composerHelperText?: React.ElementType;
}

interface ChatBoxComposerSlotProps {
  composerRoot?: Partial<ChatComposerProps>;
  composerInput?: Partial<ChatComposerTextAreaProps>;
  composerSendButton?: Partial<ChatComposerSendButtonProps>;
  composerAttachButton?: Partial<ChatComposerAttachButtonProps>;
  composerAttachmentList?: Partial<ChatComposerAttachmentListProps>;
  composerToolbar?: Partial<ChatComposerToolbarProps>;
  composerHelperText?: Partial<ChatComposerHelperTextProps>;
}

/** Standalone widgets. */
interface ChatBoxWidgetSlots {
  /** The animated typing indicator shown while the assistant responds. */
  typingIndicator?: React.ElementType;
  /** The floating scroll-to-bottom button. */
  scrollToBottom?: React.ElementType;
  /** The prompt-suggestion chips. */
  suggestions?: React.ElementType;
  /** Custom content rendered when the thread has no messages. */
  emptyState?: React.ElementType;
}

interface ChatBoxWidgetSlotProps {
  typingIndicator?: Partial<ChatTypingIndicatorProps>;
  scrollToBottom?: Partial<ChatScrollToBottomAffordanceProps>;
  suggestions?: Partial<ChatSuggestionsProps>;
  emptyState?: SlotComponentProps<'div', { sx?: SxProps<Theme> }, {}>;
}

export interface ChatBoxSlots
  extends
    ChatBoxLayoutSlots,
    ChatBoxConversationSlots,
    ChatBoxMessageListSlots,
    ChatBoxMessageSlots,
    ChatBoxComposerSlots,
    ChatBoxWidgetSlots {}

export interface ChatBoxSlotProps
  extends
    ChatBoxLayoutSlotProps,
    ChatBoxConversationSlotProps,
    ChatBoxMessageListSlotProps,
    ChatBoxMessageSlotProps,
    ChatBoxComposerSlotProps,
    ChatBoxWidgetSlotProps {}

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
   * The components used for each slot inside the ChatBox. Keys are flat and
   * prefixed by area:
   *
   * - Layout — `root`, `layout`, `conversationsPane`, `threadPane`.
   * - Conversation — `conversationRoot`, `conversationList`, `conversationHeader`,
   *   `conversationHeaderInfo`, `conversationTitle`, `conversationSubtitle`,
   *   `conversationHeaderActions`.
   * - Message list — `messageList`, `messageGroup`, `dateDivider`, `unreadMarker`.
   * - Message — `messageRoot`, `messageAvatar`, `messageContent`, `messageMeta`,
   *   `messageInlineMeta`, `messageError`, `messageActions`, `messageAuthorName`.
   *   Pass `null` to a presentational slot (`messageAvatar`, `messageMeta`,
   *   `messageInlineMeta`, `messageActions`, `messageAuthorName`) to hide it and
   *   collapse the surrounding layout.
   * - Composer — `composerRoot`, `composerInput`, `composerSendButton`,
   *   `composerAttachButton`, `composerAttachmentList`, `composerToolbar`,
   *   `composerHelperText`. Pass `null` to `composerSendButton` /
   *   `composerAttachButton` to hide the button.
   * - Widgets — `typingIndicator`, `scrollToBottom`, `suggestions`, `emptyState`.
   *
   * `*Root` slots (`conversationRoot`, `messageRoot`, `composerRoot`) are
   * wrapper-only: they swap the styled element while the default children still
   * render inside.
   */
  slots?: ChatBoxSlots;
  /**
   * Props forwarded to each slot. Mirrors the flat keys of `slots`.
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
