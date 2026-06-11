import * as React from 'react';
import { ChatBoxThumb } from './ChatBoxThumb';
import { ChatConversationThumb } from './ChatConversationThumb';
import { ChatConversationListThumb, ChatMessageListThumb } from './LayoutThumbs';
import {
  ChatConversationHeaderActionsThumb,
  ChatConversationHeaderInfoThumb,
  ChatConversationHeaderThumb,
  ChatConversationSubtitleThumb,
  ChatConversationTitleThumb,
} from './HeaderThumbs';
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
  ChatComposerHelperTextThumb,
  ChatComposerLabelThumb,
  ChatComposerSendButtonThumb,
  ChatComposerTextAreaThumb,
  ChatComposerThumb,
  ChatComposerToolbarThumb,
} from './ComposerThumbs';
import {
  ChatDateDividerThumb,
  ChatMessageSkeletonThumb,
  ChatScrollToBottomAffordanceThumb,
  ChatSuggestionsThumb,
  ChatTypingIndicatorThumb,
  ChatUnreadMarkerThumb,
} from './StateThumbs';
import {
  ChatCodeBlockThumb,
  ChatConfirmationThumb,
  ChatMessageSourceThumb,
  ChatMessageSourcesThumb,
} from './AiThumbs';

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
    href: '/x/react-chat/basics/chatbox/',
    Thumbnail: ChatBoxThumb,
  },
  {
    id: 'chat-conversation',
    name: 'ChatConversation',
    status: 'compound',
    sectionId: 'full-surfaces',
    href: '/x/react-chat/basics/conversation/',
    Thumbnail: ChatConversationThumb,
  },

  // === Layout and navigation ===
  {
    id: 'chat-conversation-list',
    name: 'ChatConversationList',
    status: 'compound',
    sectionId: 'layout-and-navigation',
    href: '/x/react-chat/multi-conversation/conversation-list/',
    Thumbnail: ChatConversationListThumb,
  },
  {
    id: 'chat-conversation-header',
    name: 'ChatConversationHeader',
    status: 'compound',
    sectionId: 'layout-and-navigation',
    href: '/x/react-chat/multi-conversation/conversation-header/',
    Thumbnail: ChatConversationHeaderThumb,
  },
  {
    id: 'chat-conversation-header-info',
    name: 'ChatConversationHeaderInfo',
    status: 'slot',
    sectionId: 'layout-and-navigation',
    href: '/x/react-chat/multi-conversation/conversation-header/',
    Thumbnail: ChatConversationHeaderInfoThumb,
  },
  {
    id: 'chat-conversation-title',
    name: 'ChatConversationTitle',
    status: 'slot',
    sectionId: 'layout-and-navigation',
    href: '/x/react-chat/multi-conversation/conversation-header/',
    Thumbnail: ChatConversationTitleThumb,
  },
  {
    id: 'chat-conversation-subtitle',
    name: 'ChatConversationSubtitle',
    status: 'slot',
    sectionId: 'layout-and-navigation',
    href: '/x/react-chat/multi-conversation/conversation-header/',
    Thumbnail: ChatConversationSubtitleThumb,
  },
  {
    id: 'chat-conversation-header-actions',
    name: 'ChatConversationHeaderActions',
    status: 'slot',
    sectionId: 'layout-and-navigation',
    href: '/x/react-chat/multi-conversation/conversation-header/',
    Thumbnail: ChatConversationHeaderActionsThumb,
  },

  // === Messages ===
  {
    id: 'chat-message-list',
    name: 'ChatMessageList',
    status: 'compound',
    sectionId: 'messages',
    href: '/x/react-chat/basics/messages/',
    Thumbnail: ChatMessageListThumb,
  },
  {
    id: 'chat-message-group',
    name: 'ChatMessageGroup',
    status: 'compound',
    sectionId: 'messages',
    href: '/x/react-chat/basics/messages/',
    Thumbnail: ChatMessageGroupThumb,
  },
  {
    id: 'chat-message',
    name: 'ChatMessage',
    status: 'compound',
    sectionId: 'messages',
    href: '/x/react-chat/basics/messages/',
    Thumbnail: ChatMessageThumb,
  },
  {
    id: 'chat-message-avatar',
    name: 'ChatMessageAvatar',
    status: 'slot',
    sectionId: 'messages',
    href: '/x/react-chat/basics/messages/',
    Thumbnail: ChatMessageAvatarThumb,
  },
  {
    id: 'chat-message-author-label',
    name: 'ChatMessageAuthorLabel',
    status: 'slot',
    sectionId: 'messages',
    href: '/x/react-chat/basics/messages/',
    Thumbnail: ChatMessageAuthorLabelThumb,
  },
  {
    id: 'chat-message-content',
    name: 'ChatMessageContent',
    status: 'slot',
    sectionId: 'messages',
    href: '/x/react-chat/basics/messages/',
    Thumbnail: ChatMessageContentThumb,
  },
  {
    id: 'chat-message-meta',
    name: 'ChatMessageMeta',
    status: 'slot',
    sectionId: 'messages',
    href: '/x/react-chat/basics/messages/',
    Thumbnail: ChatMessageMetaThumb,
  },
  {
    id: 'chat-message-inline-meta',
    name: 'ChatMessageInlineMeta',
    status: 'slot',
    sectionId: 'messages',
    href: '/x/react-chat/basics/messages/',
    Thumbnail: ChatMessageInlineMetaThumb,
  },
  {
    id: 'chat-message-actions',
    name: 'ChatMessageActions',
    status: 'slot',
    sectionId: 'messages',
    href: '/x/react-chat/display/message-actions/',
    Thumbnail: ChatMessageActionsThumb,
  },
  {
    id: 'chat-message-error',
    name: 'ChatMessageError',
    status: 'state',
    sectionId: 'messages',
    href: '/x/react-chat/behavior/error-handling/',
    Thumbnail: ChatMessageErrorThumb,
  },

  // === Composer ===
  {
    id: 'chat-composer',
    name: 'ChatComposer',
    status: 'compound',
    sectionId: 'composer',
    href: '/x/react-chat/basics/composer/',
    Thumbnail: ChatComposerThumb,
  },
  {
    id: 'chat-composer-label',
    name: 'ChatComposerLabel',
    status: 'slot',
    sectionId: 'composer',
    href: '/x/react-chat/basics/composer/',
    Thumbnail: ChatComposerLabelThumb,
  },
  {
    id: 'chat-composer-text-area',
    name: 'ChatComposerTextArea',
    status: 'slot',
    sectionId: 'composer',
    href: '/x/react-chat/basics/composer/',
    Thumbnail: ChatComposerTextAreaThumb,
  },
  {
    id: 'chat-composer-toolbar',
    name: 'ChatComposerToolbar',
    status: 'slot',
    sectionId: 'composer',
    href: '/x/react-chat/basics/composer/',
    Thumbnail: ChatComposerToolbarThumb,
  },
  {
    id: 'chat-composer-attach-button',
    name: 'ChatComposerAttachButton',
    status: 'slot',
    sectionId: 'composer',
    href: '/x/react-chat/behavior/attachments/',
    Thumbnail: ChatComposerAttachButtonThumb,
  },
  {
    id: 'chat-composer-attachment-list',
    name: 'ChatComposerAttachmentList',
    status: 'slot',
    sectionId: 'composer',
    href: '/x/react-chat/behavior/attachments/',
    Thumbnail: ChatComposerAttachmentListThumb,
  },
  {
    id: 'chat-composer-send-button',
    name: 'ChatComposerSendButton',
    status: 'slot',
    sectionId: 'composer',
    href: '/x/react-chat/basics/composer/',
    Thumbnail: ChatComposerSendButtonThumb,
  },
  {
    id: 'chat-composer-helper-text',
    name: 'ChatComposerHelperText',
    status: 'slot',
    sectionId: 'composer',
    href: '/x/react-chat/basics/composer/',
    Thumbnail: ChatComposerHelperTextThumb,
  },

  // === States ===
  {
    id: 'chat-suggestions',
    name: 'ChatSuggestions',
    status: 'state',
    sectionId: 'states',
    href: '/x/react-chat/behavior/suggestions/',
    Thumbnail: ChatSuggestionsThumb,
  },
  {
    id: 'chat-typing-indicator',
    name: 'ChatTypingIndicator',
    status: 'state',
    sectionId: 'states',
    href: '/x/react-chat/behavior/typing-indicators/',
    Thumbnail: ChatTypingIndicatorThumb,
  },
  {
    id: 'chat-unread-marker',
    name: 'ChatUnreadMarker',
    status: 'state',
    sectionId: 'states',
    href: '/x/react-chat/display/unread-marker/',
    Thumbnail: ChatUnreadMarkerThumb,
  },
  {
    id: 'chat-message-skeleton',
    name: 'ChatMessageSkeleton',
    status: 'presentational',
    sectionId: 'states',
    href: '/x/react-chat/display/loading-and-empty-states/',
    Thumbnail: ChatMessageSkeletonThumb,
  },
  {
    id: 'chat-scroll-to-bottom-affordance',
    name: 'ChatScrollToBottomAffordance',
    status: 'state',
    sectionId: 'states',
    href: '/x/react-chat/behavior/scrolling/',
    Thumbnail: ChatScrollToBottomAffordanceThumb,
  },
  {
    id: 'chat-date-divider',
    name: 'ChatDateDivider',
    status: 'state',
    sectionId: 'states',
    href: '/x/react-chat/display/date-divider/',
    Thumbnail: ChatDateDividerThumb,
  },

  // === AI and rich content ===
  {
    id: 'chat-message-sources',
    name: 'ChatMessageSources',
    status: 'presentational',
    sectionId: 'ai-and-rich-content',
    href: '/x/react-chat/display/message-parts/sources-and-citations/',
    Thumbnail: ChatMessageSourcesThumb,
  },
  {
    id: 'chat-message-source',
    name: 'ChatMessageSource',
    status: 'presentational',
    sectionId: 'ai-and-rich-content',
    href: '/x/react-chat/display/message-parts/sources-and-citations/',
    Thumbnail: ChatMessageSourceThumb,
  },
  {
    id: 'chat-code-block',
    name: 'ChatCodeBlock',
    status: 'presentational',
    sectionId: 'ai-and-rich-content',
    href: '/x/react-chat/display/message-parts/code-blocks/',
    Thumbnail: ChatCodeBlockThumb,
  },
  {
    id: 'chat-confirmation',
    name: 'ChatConfirmation',
    status: 'presentational',
    sectionId: 'ai-and-rich-content',
    href: '/x/react-chat/ai-and-agents/tool-approval/',
    Thumbnail: ChatConfirmationThumb,
  },
];

export function entriesForSection(sectionId: ChatGallerySectionId): ChatGalleryEntry[] {
  return CHAT_GALLERY.filter((entry) => entry.sectionId === sectionId);
}
