import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface ChatThreadClasses {
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

export type ChatThreadClassKey = keyof ChatThreadClasses;

export function getChatThreadUtilityClass(slot: string) {
  return generateUtilityClass('MuiChatThread', slot);
}

export const chatThreadClasses: ChatThreadClasses = generateUtilityClasses('MuiChatThread', [
  'root',
  'header',
  'title',
  'subtitle',
  'actions',
  'messageList',
  'messageListScroller',
  'messageListContent',
  'messageListOverlay',
]);
