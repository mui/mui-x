import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';

export interface ChatBoxClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the layout element. */
  layout: string;
  /** Styles applied to the conversations pane element. */
  conversationsPane: string;
  /** Styles applied to the thread pane element. */
  threadPane: string;
}

export type ChatBoxClassKey = keyof ChatBoxClasses;

export function getChatBoxUtilityClass(slot: string): string {
  return generateUtilityClass('MuiChatBox', slot);
}

export const chatBoxClasses: ChatBoxClasses = generateUtilityClasses('MuiChatBox', [
  'root',
  'layout',
  'conversationsPane',
  'threadPane',
]);

const slots: Record<ChatBoxClassKey, string[]> = {
  root: ['root'],
  layout: ['layout'],
  conversationsPane: ['conversationsPane'],
  threadPane: ['threadPane'],
};

export const useChatBoxUtilityClasses = (
  classes: Partial<ChatBoxClasses> | undefined,
): ChatBoxClasses => composeClasses(slots, getChatBoxUtilityClass, classes);
