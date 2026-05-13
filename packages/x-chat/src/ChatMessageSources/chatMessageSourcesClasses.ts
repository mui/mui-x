import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';

export interface ChatMessageSourcesClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the label element. */
  label: string;
  /** Styles applied to the list element. */
  list: string;
}

export type ChatMessageSourcesClassKey = keyof ChatMessageSourcesClasses;

export function getChatMessageSourcesUtilityClass(slot: string): string {
  return generateUtilityClass('MuiChatMessageSources', slot);
}

export const chatMessageSourcesClasses: ChatMessageSourcesClasses = generateUtilityClasses(
  'MuiChatMessageSources',
  ['root', 'label', 'list'],
);

const slots: Record<ChatMessageSourcesClassKey, string[]> = {
  root: ['root'],
  label: ['label'],
  list: ['list'],
};

export const useChatMessageSourcesUtilityClasses = (
  classes: Partial<ChatMessageSourcesClasses> | undefined,
): ChatMessageSourcesClasses => composeClasses(slots, getChatMessageSourcesUtilityClass, classes);
