import * as React from 'react';
import { ChatBoxThumb } from './ChatBoxThumb';
import { ChatConversationThumb } from './ChatConversationThumb';
import { ChatConversationListThumb, ChatMessageListThumb } from './LayoutThumbs';
import { ChatConversationHeaderThumb } from './HeaderThumbs';
import {
  ChatMessageActionsThumb,
  ChatMessageContentThumb,
  ChatMessageGroupThumb,
  ChatMessageMetaThumb,
  ChatMessageThumb,
} from './MessageThumbs';
import {
  ChatComposerAttachmentListThumb,
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
  'full-surfaces' | 'messages' | 'composer' | 'states' | 'ai-and-rich-content';

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
  // === Chat surfaces ===
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
  {
    id: 'chat-conversation-list',
    name: 'ChatConversationList',
    status: 'compound',
    sectionId: 'full-surfaces',
    href: '/x/react-chat/multi-conversation/conversation-list/',
    Thumbnail: ChatConversationListThumb,
  },
  {
    id: 'chat-conversation-header',
    name: 'ChatConversationHeader',
    status: 'compound',
    sectionId: 'full-surfaces',
    href: '/x/react-chat/multi-conversation/conversation-header/',
    Thumbnail: ChatConversationHeaderThumb,
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
    href: '/x/react-chat/basics/messages/#message-groups',
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
    id: 'chat-message-content',
    name: 'ChatMessageContent',
    status: 'slot',
    sectionId: 'messages',
    href: '/x/react-chat/basics/messages/#message-slots',
    Thumbnail: ChatMessageContentThumb,
  },
  {
    id: 'chat-message-meta',
    name: 'ChatMessageMeta',
    status: 'slot',
    sectionId: 'messages',
    href: '/x/react-chat/basics/messages/#message-slots',
    Thumbnail: ChatMessageMetaThumb,
  },
  {
    id: 'chat-message-actions',
    name: 'ChatMessageActions',
    status: 'slot',
    sectionId: 'messages',
    href: '/x/react-chat/display/message-actions/',
    Thumbnail: ChatMessageActionsThumb,
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
    id: 'chat-composer-toolbar',
    name: 'ChatComposerToolbar',
    status: 'slot',
    sectionId: 'composer',
    href: '/x/react-chat/basics/composer/',
    Thumbnail: ChatComposerToolbarThumb,
  },
  {
    id: 'chat-composer-attachment-list',
    name: 'ChatComposerAttachmentList',
    status: 'slot',
    sectionId: 'composer',
    href: '/x/react-chat/behavior/attachments/',
    Thumbnail: ChatComposerAttachmentListThumb,
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

export interface ChatGallerySection {
  /** Matches `ChatGalleryEntry.sectionId`. */
  id: ChatGallerySectionId;
  /** Heading rendered above the section grid; its slug doubles as the anchor id. */
  title: string;
  /** Intro line under the heading. Backtick spans render as inline code. */
  description: string;
}

/**
 * Section order and copy for the all-components gallery. Previously these lived
 * as `##` headings in `all-components.md`, but the gallery now owns them so an
 * empty section (after filtering) can hide its heading and description too.
 */
export const CHAT_GALLERY_SECTIONS: ChatGallerySection[] = [
  {
    id: 'full-surfaces',
    title: 'Chat surfaces',
    description:
      'The top-level building blocks you assemble a chat from: `ChatBox` for a batteries-included drop-in, `ChatConversation` to pair a message list with a composer, `ChatConversationList` for the inbox sidebar, and `ChatConversationHeader` for the conversation title bar:',
  },
  {
    id: 'messages',
    title: 'Messages',
    description:
      'The message stack from list to group to message, plus the content, meta, and actions slots inside each bubble; reach for a slot when restyling a single part instead of replacing the whole message:',
  },
  {
    id: 'composer',
    title: 'Composer',
    description:
      'The prompt form—`ChatComposer` is the shell, with a toolbar and attachment list you can swap to restyle a single part without rebuilding the form:',
  },
  {
    id: 'states',
    title: 'States',
    description:
      'Transient runtime affordances for when the conversation is loading, someone is typing, or the user has scrolled away from the latest message:',
  },
  {
    id: 'ai-and-rich-content',
    title: 'AI and rich content',
    description:
      'Presentational renderers for AI output—citations, code blocks, approval prompts, and other building blocks you can drop into custom message content without tying them to the runtime:',
  },
];
