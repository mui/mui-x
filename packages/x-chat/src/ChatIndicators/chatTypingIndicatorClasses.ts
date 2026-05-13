import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';

export interface ChatTypingIndicatorClasses {
  /** Styles applied to the root element. */
  root: string;
}

export type ChatTypingIndicatorClassKey = keyof ChatTypingIndicatorClasses;

export function getChatTypingIndicatorUtilityClass(slot: string): string {
  return generateUtilityClass('MuiChatTypingIndicator', slot);
}

export const chatTypingIndicatorClasses: ChatTypingIndicatorClasses = generateUtilityClasses(
  'MuiChatTypingIndicator',
  ['root'],
);

const slots: Record<ChatTypingIndicatorClassKey, string[]> = {
  root: ['root'],
};

export const useChatTypingIndicatorUtilityClasses = (
  classes: Partial<ChatTypingIndicatorClasses> | undefined,
): ChatTypingIndicatorClasses => composeClasses(slots, getChatTypingIndicatorUtilityClass, classes);
