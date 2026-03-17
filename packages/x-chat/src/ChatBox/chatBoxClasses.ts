import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface ChatBoxClasses {
  root: string;
  conversationsPane: string;
  threadPane: string;
  conversations: string;
  thread: string;
  composer: string;
  loadingState: string;
  errorState: string;
}

export type ChatBoxClassKey = keyof ChatBoxClasses;

export function getChatBoxUtilityClass(slot: string) {
  return generateUtilityClass('MuiChatBox', slot);
}

export const chatBoxClasses: ChatBoxClasses = generateUtilityClasses('MuiChatBox', [
  'root',
  'conversationsPane',
  'threadPane',
  'conversations',
  'thread',
  'composer',
  'loadingState',
  'errorState',
]);
