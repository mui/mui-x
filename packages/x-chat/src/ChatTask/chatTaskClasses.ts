import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';

export interface ChatTaskClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the icon element. */
  icon: string;
  /** Styles applied to the label element. */
  label: string;
  /** Styles applied to the detail element. */
  detail: string;
  /** Styles applied to the root when status is `pending`. */
  statusPending: string;
  /** Styles applied to the root when status is `running`. */
  statusRunning: string;
  /** Styles applied to the root when status is `done`. */
  statusDone: string;
  /** Styles applied to the root when status is `error`. */
  statusError: string;
  /** Styles applied to the root when status is `skipped`. */
  statusSkipped: string;
}

export type ChatTaskClassKey = keyof ChatTaskClasses;

export function getChatTaskUtilityClass(slot: string): string {
  return generateUtilityClass('MuiChatTask', slot);
}

export const chatTaskClasses: ChatTaskClasses = generateUtilityClasses('MuiChatTask', [
  'root',
  'icon',
  'label',
  'detail',
  'statusPending',
  'statusRunning',
  'statusDone',
  'statusError',
  'statusSkipped',
]);

const slots: Record<ChatTaskClassKey, string[]> = {
  root: ['root'],
  icon: ['icon'],
  label: ['label'],
  detail: ['detail'],
  statusPending: ['statusPending'],
  statusRunning: ['statusRunning'],
  statusDone: ['statusDone'],
  statusError: ['statusError'],
  statusSkipped: ['statusSkipped'],
};

export const useChatTaskUtilityClasses = (
  classes: Partial<ChatTaskClasses> | undefined,
): ChatTaskClasses => composeClasses(slots, getChatTaskUtilityClass, classes);
