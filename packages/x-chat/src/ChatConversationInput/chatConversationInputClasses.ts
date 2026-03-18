import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface ChatConversationInputClasses {
  root: string;
  input: string;
  sendButton: string;
  attachButton: string;
  toolbar: string;
  helperText: string;
}

export type ChatConversationInputClassKey = keyof ChatConversationInputClasses;

export function getChatConversationInputUtilityClass(slot: string) {
  return generateUtilityClass('MuiChatConversationInput', slot);
}

export const chatConversationInputClasses: ChatConversationInputClasses = generateUtilityClasses(
  'MuiChatConversationInput',
  ['root', 'input', 'sendButton', 'attachButton', 'toolbar', 'helperText'],
);
