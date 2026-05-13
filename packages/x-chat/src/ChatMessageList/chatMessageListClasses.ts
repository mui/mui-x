import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';

export interface ChatMessageListClasses {
  /** Styles applied to the message list root element. */
  root: string;
  /** Styles applied to the message list scroller element. */
  scroller: string;
  /** Styles applied to the message list content element. */
  content: string;
}

export type ChatMessageListClassKey = keyof ChatMessageListClasses;

export function getChatMessageListUtilityClass(slot: string): string {
  return generateUtilityClass('MuiChatMessageList', slot);
}

export const chatMessageListClasses: ChatMessageListClasses = generateUtilityClasses(
  'MuiChatMessageList',
  ['root', 'scroller', 'content'],
);

const slots: Record<ChatMessageListClassKey, string[]> = {
  root: ['root'],
  scroller: ['scroller'],
  content: ['content'],
};

export const useChatMessageListUtilityClasses = (
  classes: Partial<ChatMessageListClasses> | undefined,
): ChatMessageListClasses => composeClasses(slots, getChatMessageListUtilityClass, classes);
