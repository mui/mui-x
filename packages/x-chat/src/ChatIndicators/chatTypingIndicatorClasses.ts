import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface ChatTypingIndicatorClasses {
  root: string;
}

export type ChatTypingIndicatorClassKey = keyof ChatTypingIndicatorClasses;

export function getChatTypingIndicatorUtilityClass(slot: string) {
  return generateUtilityClass('MuiChatTypingIndicator', slot);
}

export const chatTypingIndicatorClasses: ChatTypingIndicatorClasses = generateUtilityClasses(
  'MuiChatTypingIndicator',
  ['root'],
);
