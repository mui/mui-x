import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';

export interface ChatComposerClasses {
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
  /** Styles applied to the attachment list element. */
  attachmentList: string;
  /** Styles applied to the helper text element. */
  helperText: string;
}

export type ChatComposerClassKey = keyof ChatComposerClasses;

export function getChatComposerUtilityClass(slot: string): string {
  return generateUtilityClass('MuiChatComposer', slot);
}

export const chatComposerClasses: ChatComposerClasses = generateUtilityClasses('MuiChatComposer', [
  'root',
  'label',
  'textArea',
  'sendButton',
  'attachButton',
  'toolbar',
  'attachmentList',
  'helperText',
]);

const slots: Record<ChatComposerClassKey, string[]> = {
  root: ['root'],
  label: ['label'],
  textArea: ['textArea'],
  sendButton: ['sendButton'],
  attachButton: ['attachButton'],
  toolbar: ['toolbar'],
  attachmentList: ['attachmentList'],
  helperText: ['helperText'],
};

export const useChatComposerUtilityClasses = (
  classes: Partial<ChatComposerClasses> | undefined,
): ChatComposerClasses => composeClasses(slots, getChatComposerUtilityClass, classes);
