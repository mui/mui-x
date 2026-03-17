import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface ChatConversationsClasses {
  root: string;
  loadingState: string;
  emptyState: string;
  errorState: string;
  item: string;
  itemAvatar: string;
  title: string;
  preview: string;
  timestamp: string;
  unreadBadge: string;
  state: string;
  stateGlyph: string;
}

export type ChatConversationsClassKey = keyof ChatConversationsClasses;

export function getChatConversationsUtilityClass(slot: string) {
  return generateUtilityClass('MuiChatConversations', slot);
}

export const chatConversationsClasses: ChatConversationsClasses = generateUtilityClasses(
  'MuiChatConversations',
  [
    'root',
    'loadingState',
    'emptyState',
    'errorState',
    'item',
    'itemAvatar',
    'title',
    'preview',
    'timestamp',
    'unreadBadge',
    'state',
    'stateGlyph',
  ],
);
