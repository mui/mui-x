import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';

export interface ChatMessageSkeletonClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to each shimmer line element. */
  line: string;
}

export type ChatMessageSkeletonClassKey = keyof ChatMessageSkeletonClasses;

export function getChatMessageSkeletonUtilityClass(slot: string): string {
  return generateUtilityClass('MuiChatMessageSkeleton', slot);
}

export const chatMessageSkeletonClasses: ChatMessageSkeletonClasses = generateUtilityClasses(
  'MuiChatMessageSkeleton',
  ['root', 'line'],
);

const slots: Record<ChatMessageSkeletonClassKey, string[]> = {
  root: ['root'],
  line: ['line'],
};

export const useChatMessageSkeletonUtilityClasses = (
  classes: Partial<ChatMessageSkeletonClasses> | undefined,
): ChatMessageSkeletonClasses => composeClasses(slots, getChatMessageSkeletonUtilityClass, classes);
