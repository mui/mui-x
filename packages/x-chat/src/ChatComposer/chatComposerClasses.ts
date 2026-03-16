import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface ChatComposerClasses {
  root: string;
  input: string;
  sendButton: string;
  attachButton: string;
  toolbar: string;
  helperText: string;
}

export type ChatComposerClassKey = keyof ChatComposerClasses;

export function getChatComposerUtilityClass(slot: string) {
  return generateUtilityClass('MuiChatComposer', slot);
}

export const chatComposerClasses: ChatComposerClasses = generateUtilityClasses('MuiChatComposer', [
  'root',
  'input',
  'sendButton',
  'attachButton',
  'toolbar',
  'helperText',
]);
