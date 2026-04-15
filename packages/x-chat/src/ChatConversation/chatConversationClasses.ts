import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';

export interface ChatConversationClasses {
  /** Styles applied to the conversation root element. */
  root: string;
  /** Styles applied to the conversation header element. */
  header: string;
  /** Styles applied to the conversation header info element. */
  headerInfo: string;
  /** Styles applied to the conversation title element. */
  title: string;
  /** Styles applied to the conversation subtitle element. */
  subtitle: string;
  /** Styles applied to the conversation header actions element. */
  headerActions: string;
}

export type ChatConversationClassKey = keyof ChatConversationClasses;

export function getChatConversationUtilityClass(slot: string): string {
  return generateUtilityClass('MuiChatConversation', slot);
}

export const chatConversationClasses: ChatConversationClasses = generateUtilityClasses(
  'MuiChatConversation',
  ['root', 'header', 'headerInfo', 'title', 'subtitle', 'headerActions'],
);

const slots: Record<ChatConversationClassKey, string[]> = {
  root: ['root'],
  header: ['header'],
  headerInfo: ['headerInfo'],
  title: ['title'],
  subtitle: ['subtitle'],
  headerActions: ['headerActions'],
};

export const useChatConversationUtilityClasses = (
  classes: Partial<ChatConversationClasses> | undefined,
): ChatConversationClasses => composeClasses(slots, getChatConversationUtilityClass, classes);
