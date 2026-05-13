import * as React from 'react';
import { ChatBoxThumb } from './ChatBoxThumb';
import { ChatConversationThumb } from './ChatConversationThumb';
import { ChatConversationListThumb, ChatMessageListThumb } from './LayoutThumbs';
import { ChatConversationHeaderThumb } from './HeaderThumbs';
import {
  ChatMessageActionsThumb,
  ChatMessageAuthorLabelThumb,
  ChatMessageAvatarThumb,
  ChatMessageContentThumb,
  ChatMessageErrorThumb,
  ChatMessageGroupThumb,
  ChatMessageInlineMetaThumb,
  ChatMessageMetaThumb,
  ChatMessageThumb,
} from './MessageThumbs';
import {
  ChatComposerAttachButtonThumb,
  ChatComposerAttachmentListThumb,
  ChatComposerThumb,
} from './ComposerThumbs';
import {
  ChatDateDividerThumb,
  ChatMessageSkeletonThumb,
  ChatScrollToBottomAffordanceThumb,
  ChatSuggestionsThumb,
  ChatTypingIndicatorThumb,
  ChatUnreadMarkerThumb,
} from './StateThumbs';
import { ChatCodeBlockThumb, ChatConfirmationThumb, ChatMessageSourcesThumb } from './AiThumbs';

export type ChatGallerySectionId =
  | 'full-surfaces'
  | 'layout-and-navigation'
  | 'messages'
  | 'composer'
  | 'states'
  | 'ai-and-rich-content';

export type ChatGalleryStatus = 'core' | 'compound' | 'slot' | 'state' | 'presentational';

export interface ChatGalleryEntry {
  /** Stable id (kebab-case). */
  id: string;
  /** Component name shown on the card. */
  name: string;
  /** Lifecycle / role chip displayed on the right of the card. */
  status: ChatGalleryStatus;
  /** Section the entry belongs to. */
  sectionId: ChatGallerySectionId;
  /** URL to the component's docs page. */
  href: string;
  /** Inline-SVG schematic rendered inside the card. */
  Thumbnail: React.ComponentType;
}

export const CHAT_GALLERY: ChatGalleryEntry[] = [
  // === Full surfaces ===
  {
    id: 'chat-box',
    name: 'ChatBox',
    status: 'core',
    sectionId: 'full-surfaces',
    href: '/x/react-chat/basics/chatbox/#interactive-playground',
    Thumbnail: ChatBoxThumb,
  },
  {
    id: 'chat-conversation',
    name: 'ChatConversation',
    status: 'compound',
    sectionId: 'full-surfaces',
    href: '/x/react-chat/basics/conversation/#interactive-playground',
    Thumbnail: ChatConversationThumb,
  },

  // === Layout and navigation ===
  {
    id: 'chat-conversation-list',
    name: 'ChatConversationList',
    status: 'compound',
    sectionId: 'layout-and-navigation',
    href: '/x/react-chat/multi-conversation/conversation-list/#interactive-playground',
    Thumbnail: ChatConversationListThumb,
  },
  {
    id: 'chat-conversation-header',
    name: 'ChatConversationHeader',
    status: 'compound',
    sectionId: 'layout-and-navigation',
    href: '/x/react-chat/multi-conversation/conversation-header/#interactive-playground',
    Thumbnail: ChatConversationHeaderThumb,
  },

  // === Messages ===
  {
    id: 'chat-message-list',
    name: 'ChatMessageList',
    status: 'compound',
    sectionId: 'messages',
    href: '/x/react-chat/basics/messages/#interactive-playground',
    Thumbnail: ChatMessageListThumb,
  },
  {
    id: 'chat-message-group',
    name: 'ChatMessageGroup',
    status: 'compound',
    sectionId: 'messages',
    href: '/x/react-chat/basics/messages/#interactive-playground',
    Thumbnail: ChatMessageGroupThumb,
  },
  {
    id: 'chat-message',
    name: 'ChatMessage',
    status: 'compound',
    sectionId: 'messages',
    href: '/x/react-chat/basics/messages/#interactive-playground',
    Thumbnail: ChatMessageThumb,
  },
  {
    id: 'chat-message-avatar',
    name: 'ChatMessageAvatar',
    status: 'slot',
    sectionId: 'messages',
    href: '/x/react-chat/basics/messages/#interactive-playground',
    Thumbnail: ChatMessageAvatarThumb,
  },
  {
    id: 'chat-message-author-label',
    name: 'ChatMessageAuthorLabel',
    status: 'slot',
    sectionId: 'messages',
    href: '/x/react-chat/basics/messages/#interactive-playground',
    Thumbnail: ChatMessageAuthorLabelThumb,
  },
  {
    id: 'chat-message-content',
    name: 'ChatMessageContent',
    status: 'slot',
    sectionId: 'messages',
    href: '/x/react-chat/basics/messages/#interactive-playground',
    Thumbnail: ChatMessageContentThumb,
  },
  {
    id: 'chat-message-meta',
    name: 'ChatMessageMeta',
    status: 'slot',
    sectionId: 'messages',
    href: '/x/react-chat/basics/messages/#interactive-playground',
    Thumbnail: ChatMessageMetaThumb,
  },
  {
    id: 'chat-message-inline-meta',
    name: 'ChatMessageInlineMeta',
    status: 'slot',
    sectionId: 'messages',
    href: '/x/react-chat/basics/messages/#interactive-playground',
    Thumbnail: ChatMessageInlineMetaThumb,
  },
  {
    id: 'chat-message-actions',
    name: 'ChatMessageActions',
    status: 'slot',
    sectionId: 'messages',
    href: '/x/react-chat/display/message-actions/#interactive-playground',
    Thumbnail: ChatMessageActionsThumb,
  },
  {
    id: 'chat-message-error',
    name: 'ChatMessageError',
    status: 'state',
    sectionId: 'messages',
    href: '/x/react-chat/behavior/error-handling/#interactive-playground',
    Thumbnail: ChatMessageErrorThumb,
  },

  // === Composer ===
  {
    id: 'chat-composer',
    name: 'ChatComposer',
    status: 'compound',
    sectionId: 'composer',
    href: '/x/react-chat/basics/composer/#interactive-playground',
    Thumbnail: ChatComposerThumb,
  },
  {
    id: 'chat-composer-attach-button',
    name: 'ChatComposerAttachButton',
    status: 'slot',
    sectionId: 'composer',
    href: '/x/react-chat/behavior/attachments/#interactive-playgrounds',
    Thumbnail: ChatComposerAttachButtonThumb,
  },
  {
    id: 'chat-composer-attachment-list',
    name: 'ChatComposerAttachmentList',
    status: 'slot',
    sectionId: 'composer',
    href: '/x/react-chat/behavior/attachments/#interactive-playgrounds',
    Thumbnail: ChatComposerAttachmentListThumb,
  },

  // === States ===
  {
    id: 'chat-suggestions',
    name: 'ChatSuggestions',
    status: 'state',
    sectionId: 'states',
    href: '/x/react-chat/behavior/suggestions/#interactive-playground',
    Thumbnail: ChatSuggestionsThumb,
  },
  {
    id: 'chat-typing-indicator',
    name: 'ChatTypingIndicator',
    status: 'state',
    sectionId: 'states',
    href: '/x/react-chat/behavior/typing-indicators/#interactive-playground',
    Thumbnail: ChatTypingIndicatorThumb,
  },
  {
    id: 'chat-unread-marker',
    name: 'ChatUnreadMarker',
    status: 'state',
    sectionId: 'states',
    href: '/x/react-chat/display/unread-marker/#interactive-playground',
    Thumbnail: ChatUnreadMarkerThumb,
  },
  {
    id: 'chat-message-skeleton',
    name: 'ChatMessageSkeleton',
    status: 'presentational',
    sectionId: 'states',
    href: '/x/react-chat/display/loading-and-empty-states/#interactive-playground',
    Thumbnail: ChatMessageSkeletonThumb,
  },
  {
    id: 'chat-scroll-to-bottom-affordance',
    name: 'ChatScrollToBottomAffordance',
    status: 'state',
    sectionId: 'states',
    href: '/x/react-chat/behavior/scrolling/#interactive-playground',
    Thumbnail: ChatScrollToBottomAffordanceThumb,
  },
  {
    id: 'chat-date-divider',
    name: 'ChatDateDivider',
    status: 'state',
    sectionId: 'states',
    href: '/x/react-chat/display/date-divider/#interactive-playground',
    Thumbnail: ChatDateDividerThumb,
  },

  // === AI and rich content ===
  {
    id: 'chat-message-sources',
    name: 'ChatMessageSources',
    status: 'presentational',
    sectionId: 'ai-and-rich-content',
    href: '/x/react-chat/display/message-parts/sources-and-citations/#interactive-playground',
    Thumbnail: ChatMessageSourcesThumb,
  },
  {
    id: 'chat-code-block',
    name: 'ChatCodeBlock',
    status: 'presentational',
    sectionId: 'ai-and-rich-content',
    href: '/x/react-chat/display/message-parts/code-blocks/#interactive-playground',
    Thumbnail: ChatCodeBlockThumb,
  },
  {
    id: 'chat-confirmation',
    name: 'ChatConfirmation',
    status: 'presentational',
    sectionId: 'ai-and-rich-content',
    href: '/x/react-chat/ai-and-agents/tool-approval/#interactive-playground',
    Thumbnail: ChatConfirmationThumb,
  },
];

export function entriesForSection(sectionId: ChatGallerySectionId): ChatGalleryEntry[] {
  return CHAT_GALLERY.filter((entry) => entry.sectionId === sectionId);
}
