import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface ChatMessageSkeletonClasses {
  root: string;
  bubble: string;
}

export type ChatMessageSkeletonClassKey = keyof ChatMessageSkeletonClasses;

export function getChatMessageSkeletonUtilityClass(slot: string) {
  return generateUtilityClass('MuiChatMessageSkeleton', slot);
}

export const chatMessageSkeletonClasses: ChatMessageSkeletonClasses = generateUtilityClasses(
  'MuiChatMessageSkeleton',
  ['root', 'bubble'],
);
