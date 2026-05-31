import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';

export interface CopilotPanelClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the header element. */
  header: string;
  /** Styles applied to the title element. */
  title: string;
  /** Styles applied to the "beta" badge element. */
  beta: string;
  /** Styles applied to the thread element. */
  thread: string;
  /** Styles applied to the body element. */
  body: string;
  /** Styles applied to the footer element. */
  footer: string;
  /** Styles applied to each message element. */
  message: string;
  /** Styles applied to the per-message metadata element. */
  metadata: string;
  /** Styles applied to the suggestions element. */
  suggestions: string;
  /** Styles applied to the history element. */
  history: string;
  /** Styles applied to each history item element. */
  historyItem: string;
  /** Styles applied to the empty-state element. */
  emptyState: string;
  /** Styles applied to the composer element. */
  composer: string;
}

export type CopilotPanelClassKey = keyof CopilotPanelClasses;

export function getCopilotPanelUtilityClass(slot: string): string {
  return generateUtilityClass('MuiCopilotPanel', slot);
}

export const copilotPanelClasses: CopilotPanelClasses = generateUtilityClasses('MuiCopilotPanel', [
  'root',
  'header',
  'title',
  'beta',
  'thread',
  'body',
  'footer',
  'message',
  'metadata',
  'suggestions',
  'history',
  'historyItem',
  'emptyState',
  'composer',
]);

const slots: Record<CopilotPanelClassKey, string[]> = {
  root: ['root'],
  header: ['header'],
  title: ['title'],
  beta: ['beta'],
  thread: ['thread'],
  body: ['body'],
  footer: ['footer'],
  message: ['message'],
  metadata: ['metadata'],
  suggestions: ['suggestions'],
  history: ['history'],
  historyItem: ['historyItem'],
  emptyState: ['emptyState'],
  composer: ['composer'],
};

export const useCopilotPanelUtilityClasses = (
  classes: Partial<CopilotPanelClasses> | undefined,
): CopilotPanelClasses => composeClasses(slots, getCopilotPanelUtilityClass, classes);
