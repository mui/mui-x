import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';

export interface ChatConversationInputClasses {
  /** Styles applied to the input root element. */
  root: string;
  /** Styles applied to the input label element. */
  label: string;
  /** Styles applied to the textarea element. */
  textArea: string;
  /** Styles applied to the send button element. */
  sendButton: string;
  /** Styles applied to the attach button element. */
  attachButton: string;
  /** Styles applied to the toolbar element. */
  toolbar: string;
  /** Styles applied to the helper text element. */
  helperText: string;
}

export type ChatConversationInputClassKey = keyof ChatConversationInputClasses;

export function getChatConversationInputUtilityClass(slot: string): string {
  return generateUtilityClass('MuiChatConversationInput', slot);
}

export const chatConversationInputClasses: ChatConversationInputClasses = generateUtilityClasses(
  'MuiChatConversationInput',
  ['root', 'label', 'textArea', 'sendButton', 'attachButton', 'toolbar', 'helperText'],
);

const slots: Record<ChatConversationInputClassKey, string[]> = {
  root: ['root'],
  label: ['label'],
  textArea: ['textArea'],
  sendButton: ['sendButton'],
  attachButton: ['attachButton'],
  toolbar: ['toolbar'],
  helperText: ['helperText'],
};

export const useChatConversationInputUtilityClasses = (
  classes: Partial<ChatConversationInputClasses> | undefined,
): ChatConversationInputClasses =>
  composeClasses(slots, getChatConversationInputUtilityClass, classes);
