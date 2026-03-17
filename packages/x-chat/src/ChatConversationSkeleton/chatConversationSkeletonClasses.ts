import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface ChatConversationSkeletonClasses {
  root: string;
  avatar: string;
}

export type ChatConversationSkeletonClassKey = keyof ChatConversationSkeletonClasses;

export function getChatConversationSkeletonUtilityClass(slot: string) {
  return generateUtilityClass('MuiChatConversationSkeleton', slot);
}

export const chatConversationSkeletonClasses: ChatConversationSkeletonClasses =
  generateUtilityClasses('MuiChatConversationSkeleton', ['root', 'avatar']);
