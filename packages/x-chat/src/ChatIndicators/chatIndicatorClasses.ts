import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';

export interface ChatIndicatorClasses {
  /** Styles applied to the typing indicator root element. */
  typingIndicator: string;
  /** Styles applied to the unread marker root element. */
  unreadMarker: string;
  /** Styles applied to the scroll-to-bottom affordance root element. */
  scrollToBottom: string;
}

export type ChatIndicatorClassKey = keyof ChatIndicatorClasses;

export function getChatIndicatorUtilityClass(slot: string): string {
  return generateUtilityClass('MuiChatIndicator', slot);
}

export const chatIndicatorClasses: ChatIndicatorClasses = generateUtilityClasses(
  'MuiChatIndicator',
  ['typingIndicator', 'unreadMarker', 'scrollToBottom'],
);

const slots: Record<ChatIndicatorClassKey, string[]> = {
  typingIndicator: ['typingIndicator'],
  unreadMarker: ['unreadMarker'],
  scrollToBottom: ['scrollToBottom'],
};

export const useChatIndicatorUtilityClasses = (
  classes: Partial<ChatIndicatorClasses> | undefined,
): ChatIndicatorClasses => composeClasses(slots, getChatIndicatorUtilityClass, classes);
