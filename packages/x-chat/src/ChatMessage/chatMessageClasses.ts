import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface ChatMessageClasses {
  root: string;
  avatar: string;
  content: string;
  bubble: string;
  reasoning: string;
  reasoningSummary: string;
  reasoningContent: string;
  tool: string;
  toolHeader: string;
  toolTitle: string;
  toolState: string;
  toolSection: string;
  toolSectionContent: string;
  toolError: string;
  toolActions: string;
  toolApproveButton: string;
  toolDenyButton: string;
  file: string;
  filePreview: string;
  fileLink: string;
  fileName: string;
  sourceUrl: string;
  sourceUrlIcon: string;
  sourceUrlLink: string;
  sourceDocument: string;
  sourceDocumentTitle: string;
  sourceDocumentExcerpt: string;
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
  'reasoning',
  'reasoningSummary',
  'reasoningContent',
  'tool',
  'toolHeader',
  'toolTitle',
  'toolState',
  'toolSection',
  'toolSectionContent',
  'toolError',
  'toolActions',
  'toolApproveButton',
  'toolDenyButton',
  'file',
  'filePreview',
  'fileLink',
  'fileName',
  'sourceUrl',
  'sourceUrlIcon',
  'sourceUrlLink',
  'sourceDocument',
  'sourceDocumentTitle',
  'sourceDocumentExcerpt',
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
