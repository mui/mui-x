import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface ChatMessageClasses {
  root: string;
  avatar: string;
  content: string;
  bubble: string;
  markdown: string;
  markdownContent: string;
  markdownHeading: string;
  markdownLink: string;
  markdownBlockquote: string;
  meta: string;
  timestamp: string;
  status: string;
  edited: string;
  actions: string;
  inlineCode: string;
  codeBlock: string;
  codeBlockPre: string;
  codeBlockToolbar: string;
  codeBlockLanguage: string;
  codeBlockCopyButton: string;
}

export type ChatMessageClassKey = keyof ChatMessageClasses;

export function getChatMessageUtilityClass(slot: string) {
  return generateUtilityClass('MuiChatMessage', slot);
}

export const chatMessageClasses: ChatMessageClasses = generateUtilityClasses('MuiChatMessage', [
  'root',
  'avatar',
  'content',
  'bubble',
  'markdown',
  'markdownContent',
  'markdownHeading',
  'markdownLink',
  'markdownBlockquote',
  'meta',
  'timestamp',
  'status',
  'edited',
  'actions',
  'inlineCode',
  'codeBlock',
  'codeBlockPre',
  'codeBlockToolbar',
  'codeBlockLanguage',
  'codeBlockCopyButton',
]);
