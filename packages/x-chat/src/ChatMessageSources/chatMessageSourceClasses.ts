import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';

export interface ChatMessageSourceClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the index badge element. */
  index: string;
  /** Styles applied to the link element. */
  link: string;
}

export type ChatMessageSourceClassKey = keyof ChatMessageSourceClasses;

export function getChatMessageSourceUtilityClass(slot: string): string {
  return generateUtilityClass('MuiChatMessageSource', slot);
}

export const chatMessageSourceClasses: ChatMessageSourceClasses = generateUtilityClasses(
  'MuiChatMessageSource',
  ['root', 'index', 'link'],
);

const slots: Record<ChatMessageSourceClassKey, string[]> = {
  root: ['root'],
  index: ['index'],
  link: ['link'],
};

export const useChatMessageSourceUtilityClasses = (
  classes: Partial<ChatMessageSourceClasses> | undefined,
): ChatMessageSourceClasses => composeClasses(slots, getChatMessageSourceUtilityClass, classes);
