import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface ChatMessageClasses {
  root: string;
  avatar: string;
  content: string;
  bubble: string;
  meta: string;
  timestamp: string;
  status: string;
  edited: string;
  actions: string;
}

export type ChatMessageClassKey = keyof ChatMessageClasses;

export function getChatMessageUtilityClass(slot: string) {
  return generateUtilityClass('MuiChatMessage', slot);
}

export const chatMessageClasses: ChatMessageClasses = generateUtilityClasses('MuiChatMessage', [
  'root',
  'avatar',
  'content',
  'bubble',
  'meta',
  'timestamp',
  'status',
  'edited',
  'actions',
]);
