import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';

export interface ChatSuggestionsClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to each suggestion item. */
  item: string;
}

export type ChatSuggestionsClassKey = keyof ChatSuggestionsClasses;

export function getChatSuggestionsUtilityClass(slot: string): string {
  return generateUtilityClass('MuiChatSuggestions', slot);
}

export const chatSuggestionsClasses: ChatSuggestionsClasses = generateUtilityClasses(
  'MuiChatSuggestions',
  ['root', 'item'],
);

const slots: Record<ChatSuggestionsClassKey, string[]> = {
  root: ['root'],
  item: ['item'],
};

export const useChatSuggestionsUtilityClasses = (
  classes: Partial<ChatSuggestionsClasses> | undefined,
): ChatSuggestionsClasses => composeClasses(slots, getChatSuggestionsUtilityClass, classes);
