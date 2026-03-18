'use client';
import { ChatMessageRoot } from './ChatMessageRoot';
import { ChatMessageAvatar } from './ChatMessageAvatar';
import { ChatMessageContent } from './ChatMessageContent';
import { ChatMessageMeta } from './ChatMessageMeta';
import { ChatMessageActions } from './ChatMessageActions';

export { ChatMessageRoot } from './ChatMessageRoot';
export type {
  ChatMessageRootProps,
  ChatMessageRootSlotProps,
  ChatMessageRootSlots,
} from './ChatMessageRoot';
export { ChatMessageAvatar } from './ChatMessageAvatar';
export type {
  ChatMessageAvatarProps,
  ChatMessageAvatarSlotProps,
  ChatMessageAvatarSlots,
} from './ChatMessageAvatar';
export { ChatMessageContent } from './ChatMessageContent';
export type {
  ChatMessageContentProps,
  ChatMessageContentSlotProps,
  ChatMessageContentSlots,
} from './ChatMessageContent';
export { ChatMessageMeta } from './ChatMessageMeta';
export type {
  ChatMessageMetaProps,
  ChatMessageMetaSlotProps,
  ChatMessageMetaSlots,
} from './ChatMessageMeta';
export { ChatMessageActions } from './ChatMessageActions';
export type {
  ChatMessageActionsProps,
  ChatMessageActionsSlotProps,
  ChatMessageActionsSlots,
} from './ChatMessageActions';
export { ChatMessageGroup } from './ChatMessageGroup';
export type {
  ChatMessageGroupProps,
  ChatMessageGroupSlotProps,
  ChatMessageGroupSlots,
} from './ChatMessageGroup';
export { ChatDateDivider } from './ChatDateDivider';
export type {
  ChatDateDividerProps,
  ChatDateDividerSlotProps,
  ChatDateDividerSlots,
} from './ChatDateDivider';

export type {
  ChatMarkdownTextPartProps,
  ChatMarkdownTextPartRendererOptions,
  ChatMarkdownTextPartSlotProps,
  ChatMarkdownTextPartSlots,
} from './ChatMarkdownTextPart';
export type {
  ChatFilePartRendererOptions,
  ChatFilePartRendererProps,
  ChatFilePartRendererSlotProps,
  ChatFilePartRendererSlots,
  ChatReasoningPartRendererOptions,
  ChatReasoningPartRendererProps,
  ChatReasoningPartRendererSlotProps,
  ChatReasoningPartRendererSlots,
  ChatSourceDocumentPartRendererOptions,
  ChatSourceDocumentPartRendererProps,
  ChatSourceDocumentPartRendererSlotProps,
  ChatSourceDocumentPartRendererSlots,
  ChatSourceUrlPartRendererOptions,
  ChatSourceUrlPartRendererProps,
  ChatSourceUrlPartRendererSlotProps,
  ChatSourceUrlPartRendererSlots,
  ChatToolPartRendererOptions,
  ChatToolPartRendererProps,
  ChatToolPartRendererSlotProps,
  ChatToolPartRendererSlots,
} from './ChatAiPartRenderers';

export const ChatMessage = {
  Root: ChatMessageRoot,
  Avatar: ChatMessageAvatar,
  Content: ChatMessageContent,
  Meta: ChatMessageMeta,
  Actions: ChatMessageActions,
} as const;

export {
  ChatFilePartRenderer,
  ChatReasoningPartRenderer,
  ChatSourceDocumentPartRenderer,
  ChatSourceUrlPartRenderer,
  ChatToolPartRenderer,
  createChatFilePartRenderer,
  createChatReasoningPartRenderer,
  createChatSourceDocumentPartRenderer,
  createChatSourceUrlPartRenderer,
  createChatToolPartRenderer,
} from './ChatAiPartRenderers';
export { ChatMarkdownTextPart, createChatMarkdownTextPartRenderer } from './ChatMarkdownTextPart';
export { chatMessageClasses, getChatMessageUtilityClass } from './chatMessageClasses';
