import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';

export interface ChatConfirmationClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the icon element. */
  icon: string;
  /** Styles applied to the message element. */
  message: string;
  /** Styles applied to the actions container element. */
  actions: string;
  /** Styles applied to the confirm button element. */
  confirmButton: string;
  /** Styles applied to the cancel button element. */
  cancelButton: string;
}

export type ChatConfirmationClassKey = keyof ChatConfirmationClasses;

export function getChatConfirmationUtilityClass(slot: string): string {
  return generateUtilityClass('MuiChatConfirmation', slot);
}

export const chatConfirmationClasses: ChatConfirmationClasses = generateUtilityClasses(
  'MuiChatConfirmation',
  ['root', 'icon', 'message', 'actions', 'confirmButton', 'cancelButton'],
);

const slots: Record<ChatConfirmationClassKey, string[]> = {
  root: ['root'],
  icon: ['icon'],
  message: ['message'],
  actions: ['actions'],
  confirmButton: ['confirmButton'],
  cancelButton: ['cancelButton'],
};

export const useChatConfirmationUtilityClasses = (
  classes: Partial<ChatConfirmationClasses> | undefined,
): ChatConfirmationClasses => composeClasses(slots, getChatConfirmationUtilityClass, classes);
