import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface ChatConversationClasses {
  root: string;
  header: string;
  title: string;
  subtitle: string;
  actions: string;
  messageList: string;
  messageListScroller: string;
  messageListContent: string;
  messageListOverlay: string;
}

export type ChatConversationClassKey = keyof ChatConversationClasses;

export function getChatConversationUtilityClass(slot: string) {
  return generateUtilityClass('MuiChatConversation', slot);
}

export const chatConversationClasses: ChatConversationClasses = generateUtilityClasses(
  'MuiChatConversation',
  [
    'root',
    'header',
    'title',
    'subtitle',
    'actions',
    'messageList',
    'messageListScroller',
    'messageListContent',
    'messageListOverlay',
  ],
);
