import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';

export interface ChatMessageClasses {
  /** Styles applied to the message root element. */
  root: string;
  /** Styles applied to the message avatar element. */
  avatar: string;
  /** Styles applied to the message author label element. */
  authorLabel: string;
  /** Styles applied to the message content element. */
  content: string;
  /** Styles applied to the message bubble element inside content. */
  bubble: string;
  /** Styles applied to the message meta element. */
  meta: string;
  /** Styles applied to the message actions element. */
  actions: string;
  /** Styles applied to the message group element. */
  group: string;
  /** Styles applied to the date divider element. */
  dateDivider: string;
}

export type ChatMessageClassKey = keyof ChatMessageClasses;

export function getChatMessageUtilityClass(slot: string): string {
  return generateUtilityClass('MuiChatMessage', slot);
}

export const chatMessageClasses: ChatMessageClasses = generateUtilityClasses('MuiChatMessage', [
  'root',
  'avatar',
  'authorLabel',
  'content',
  'bubble',
  'meta',
  'actions',
  'group',
  'dateDivider',
]);

const slots: Record<ChatMessageClassKey, string[]> = {
  root: ['root'],
  avatar: ['avatar'],
  authorLabel: ['authorLabel'],
  content: ['content'],
  bubble: ['bubble'],
  meta: ['meta'],
  actions: ['actions'],
  group: ['group'],
  dateDivider: ['dateDivider'],
};

export const useChatMessageUtilityClasses = (
  classes: Partial<ChatMessageClasses> | undefined,
): ChatMessageClasses => composeClasses(slots, getChatMessageUtilityClass, classes);
