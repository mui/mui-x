import * as React from 'react';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import {
  type ChatRootProps,
  type MessageListRootAutoScrollConfig,
  type ChatSuggestion,
  type ChatVariant,
  type ChatDensity,
  type ChatAttachmentsConfig,
} from '@mui/x-chat-headless';
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

export interface ChatBoxSlots {
  /** The outermost container element. Defaults to `div`. */
  root: React.ElementType;
  /** The layout element that arranges conversations + thread panes. Defaults to `div`. */
  layout: React.ElementType;
  /** The conversations pane container. Defaults to `div`. */
  conversationsPane: React.ElementType;
  /** The thread pane container. Defaults to `div`. */
  threadPane: React.ElementType;
  /** Override the conversation list component. */
  conversationList: React.ElementType;
  /** Override the conversation header component. */
  conversationHeader: React.ElementType;
  /** Override the conversation title component. */
  conversationTitle: React.ElementType;
  /** Override the conversation subtitle component. */
  conversationSubtitle: React.ElementType;
  /** Override the conversation header info wrapper (title + subtitle column). */
  conversationHeaderInfo: React.ElementType;
  /** Override the conversation header actions component. */
  conversationHeaderActions: React.ElementType;
  /** Override the message list component. */
  messageList: React.ElementType;
  /** Override the message root component for each message. */
  messageRoot: React.ElementType;
  /** Override the message avatar component. */
  messageAvatar: React.ElementType;
  /** Override the message content (bubble) component. */
  messageContent: React.ElementType;
  /** Override the message meta component. */
  messageMeta: React.ElementType;
  /** Override the message actions component. */
  messageActions: React.ElementType;
  /** Override the message group component. */
  messageGroup: React.ElementType;
  /** Override the date divider component. */
  dateDivider: React.ElementType;
  /** Override the composer (input) root component. */
  composerRoot: React.ElementType;
  /** Override the composer textarea component. */
  composerInput: React.ElementType;
  /** Override the composer send button. */
  composerSendButton: React.ElementType;
  /** Override the composer attach button. */
  composerAttachButton: React.ElementType;
  /** Override the composer attachment list. */
  composerAttachmentList: React.ElementType;
  /** Override the composer toolbar. */
  composerToolbar: React.ElementType;
  /** Override the composer helper text component. */
  composerHelperText: React.ElementType;
  /** Override the typing indicator component. */
  typingIndicator: React.ElementType;
  /** Override the unread marker component. */
  unreadMarker: React.ElementType;
  /** Override the scroll-to-bottom affordance component. */
  scrollToBottom: React.ElementType;
  /** Override the prompt suggestions container component. */
  suggestions: React.ElementType;
}

export interface ChatBoxSlotProps {
  root?: SlotComponentPropsFromProps<'div', { sx?: SxProps<Theme> }, {}>;
  layout?: SlotComponentPropsFromProps<'div', { sx?: SxProps<Theme> }, {}>;
  conversationsPane?: SlotComponentPropsFromProps<'div', { sx?: SxProps<Theme> }, {}>;
  threadPane?: SlotComponentPropsFromProps<'div', { sx?: SxProps<Theme> }, {}>;
  conversationList?: Partial<ChatConversationListProps>;
  conversationHeader?: Partial<ChatConversationHeaderProps>;
  conversationTitle?: Partial<ChatConversationTitleProps>;
  conversationSubtitle?: Partial<ChatConversationSubtitleProps>;
  conversationHeaderInfo?: Partial<ChatConversationHeaderInfoProps>;
  conversationHeaderActions?: Partial<ChatConversationHeaderActionsProps>;
  messageList?: Partial<ChatMessageListProps>;
  messageRoot?: Partial<ChatMessageProps>;
  messageAvatar?: Partial<ChatMessageAvatarProps>;
  messageContent?: Partial<ChatMessageContentProps>;
  messageMeta?: Partial<ChatMessageMetaProps>;
  messageActions?: Partial<ChatMessageActionsProps>;
  messageGroup?: Partial<ChatMessageGroupProps>;
  dateDivider?: Partial<ChatDateDividerProps>;
  composerRoot?: Partial<ChatComposerProps>;
  composerInput?: Partial<ChatComposerTextAreaProps>;
  composerSendButton?: Partial<ChatComposerSendButtonProps>;
  composerAttachButton?: Partial<ChatComposerAttachButtonProps>;
  composerAttachmentList?: Partial<ChatComposerAttachmentListProps>;
  composerToolbar?: Partial<ChatComposerToolbarProps>;
  composerHelperText?: Partial<ChatComposerHelperTextProps>;
  typingIndicator?: Partial<ChatTypingIndicatorProps>;
  unreadMarker?: Partial<ChatUnreadMarkerProps>;
  scrollToBottom?: Partial<ChatScrollToBottomAffordanceProps>;
  suggestions?: Partial<ChatSuggestionsProps>;
}

export interface ChatBoxFeatures {
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
   * The components used for each slot inside the ChatBox.
   */
  slots?: Partial<ChatBoxSlots>;
  /**
   * The extra props for the slot components.
   */
  slotProps?: ChatBoxSlotProps;
  /**
   * Feature flags to enable or disable built-in ChatBox behaviours.
   */
  features?: ChatBoxFeatures;
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
