import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';

export interface ChatMessageErrorClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the message text element. */
  message: string;
  /** Styles applied to the retry button. */
  retryButton: string;
}

export type ChatMessageErrorClassKey = keyof ChatMessageErrorClasses;

export function getChatMessageErrorUtilityClass(slot: string): string {
  return generateUtilityClass('MuiChatMessageError', slot);
}

export const chatMessageErrorClasses: ChatMessageErrorClasses = generateUtilityClasses(
  'MuiChatMessageError',
  ['root', 'message', 'retryButton'],
);

const slots: Record<ChatMessageErrorClassKey, string[]> = {
  root: ['root'],
  message: ['message'],
  retryButton: ['retryButton'],
};

export const useChatMessageErrorUtilityClasses = (
  classes: Partial<ChatMessageErrorClasses> | undefined,
): ChatMessageErrorClasses => composeClasses(slots, getChatMessageErrorUtilityClass, classes);
