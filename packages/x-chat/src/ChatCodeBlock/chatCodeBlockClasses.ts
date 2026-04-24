import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';

export interface ChatCodeBlockClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the header element. */
  header: string;
  /** Styles applied to the language label element. */
  languageLabel: string;
  /** Styles applied to the copy button element. */
  copyButton: string;
  /** Styles applied to the pre element. */
  pre: string;
  /** Styles applied to the code element. */
  code: string;
}

export type ChatCodeBlockClassKey = keyof ChatCodeBlockClasses;

export function getChatCodeBlockUtilityClass(slot: string): string {
  return generateUtilityClass('MuiChatCodeBlock', slot);
}

export const chatCodeBlockClasses: ChatCodeBlockClasses = generateUtilityClasses(
  'MuiChatCodeBlock',
  ['root', 'header', 'languageLabel', 'copyButton', 'pre', 'code'],
);

const slots: Record<ChatCodeBlockClassKey, string[]> = {
  root: ['root'],
  header: ['header'],
  languageLabel: ['languageLabel'],
  copyButton: ['copyButton'],
  pre: ['pre'],
  code: ['code'],
};

export const useChatCodeBlockUtilityClasses = (
  classes: Partial<ChatCodeBlockClasses> | undefined,
): ChatCodeBlockClasses => composeClasses(slots, getChatCodeBlockUtilityClass, classes);
