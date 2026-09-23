import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';

export interface ChatStreamingIndicatorClasses {
  /** Styles applied to the root element (the dots). */
  root: string;
  /** Styles applied to the waiting-phase assistant row wrapper. */
  row: string;
  /** Styles applied to the waiting-phase typing bubble. */
  bubble: string;
}

export type ChatStreamingIndicatorClassKey = keyof ChatStreamingIndicatorClasses;

export function getChatStreamingIndicatorUtilityClass(slot: string): string {
  return generateUtilityClass('MuiChatStreamingIndicator', slot);
}

export const chatStreamingIndicatorClasses: ChatStreamingIndicatorClasses = generateUtilityClasses(
  'MuiChatStreamingIndicator',
  ['root', 'row', 'bubble'],
);

const slots: Record<ChatStreamingIndicatorClassKey, string[]> = {
  root: ['root'],
  row: ['row'],
  bubble: ['bubble'],
};

export const useChatStreamingIndicatorUtilityClasses = (
  classes: Partial<ChatStreamingIndicatorClasses> | undefined,
): ChatStreamingIndicatorClasses =>
  composeClasses(slots, getChatStreamingIndicatorUtilityClass, classes);
