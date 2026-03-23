import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';

export interface ChatPlanClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the title element. */
  title: string;
  /** Styles applied to the list container element. */
  list: string;
}

export type ChatPlanClassKey = keyof ChatPlanClasses;

export function getChatPlanUtilityClass(slot: string): string {
  return generateUtilityClass('MuiChatPlan', slot);
}

export const chatPlanClasses: ChatPlanClasses = generateUtilityClasses('MuiChatPlan', [
  'root',
  'title',
  'list',
]);

const slots: Record<ChatPlanClassKey, string[]> = {
  root: ['root'],
  title: ['title'],
  list: ['list'],
};

export const useChatPlanUtilityClasses = (
  classes: Partial<ChatPlanClasses> | undefined,
): ChatPlanClasses => composeClasses(slots, getChatPlanUtilityClass, classes);
