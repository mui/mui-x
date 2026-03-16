import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface ChatScrollToBottomAffordanceClasses {
  root: string;
  badge: string;
}

export type ChatScrollToBottomAffordanceClassKey = keyof ChatScrollToBottomAffordanceClasses;

export function getChatScrollToBottomAffordanceUtilityClass(slot: string) {
  return generateUtilityClass('MuiChatScrollToBottomAffordance', slot);
}

export const chatScrollToBottomAffordanceClasses: ChatScrollToBottomAffordanceClasses =
  generateUtilityClasses('MuiChatScrollToBottomAffordance', ['root', 'badge']);
