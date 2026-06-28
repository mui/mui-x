import generateUtilityClass from '@mui/utils/generateUtilityClass';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface ChartCopilotClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the panel container. */
  panel: string;
  /** Styles applied to the panel header. */
  panelHeader: string;
  /** Styles applied to the panel body (conversation area). */
  panelBody: string;
  /** Styles applied to the panel footer (composer area). */
  panelFooter: string;
  /** Styles applied to the toolbar trigger button. */
  trigger: string;
  /** Styles applied to an analyze panel root element. */
  analyzePanel: string;
  /** Styles applied to an analyze panel section header. */
  analyzePanelHeader: string;
  /** Styles applied to the Analyze menu root element. */
  analyzeMenu: string;
  /** Styles applied to the Analyze menu trigger button. */
  analyzeMenuTrigger: string;
  /** Styles applied to the Analyze menu result container. */
  analyzeMenuResult: string;
  /** Styles applied to the per-turn receipt card. */
  receipt: string;
  /** Styles applied to a single receipt clause chip. */
  receiptClause: string;
  /** Styles applied to the step-history panel. */
  stepHistory: string;
  /** Styles applied to a single step-history row. */
  stepHistoryItem: string;
  /** Styles applied to the one-line numeric answer banner. */
  answerBanner: string;
  /** Styles applied to the proactive anomaly suggestion chip. */
  proactiveChip: string;
  /** Styles applied to the focus breadcrumb (zoom/highlight indicator). */
  focusBreadcrumb: string;
}

export type ChartCopilotClassKey = keyof ChartCopilotClasses;

export function getChartCopilotUtilityClass(slot: string): string {
  return generateUtilityClass('MuiChartCopilot', slot);
}

export const chartCopilotClasses: ChartCopilotClasses = generateUtilityClasses('MuiChartCopilot', [
  'root',
  'panel',
  'panelHeader',
  'panelBody',
  'panelFooter',
  'trigger',
  'analyzePanel',
  'analyzePanelHeader',
  'analyzeMenu',
  'analyzeMenuTrigger',
  'analyzeMenuResult',
  'receipt',
  'receiptClause',
  'stepHistory',
  'stepHistoryItem',
  'answerBanner',
  'proactiveChip',
  'focusBreadcrumb',
]);

const slots: Record<ChartCopilotClassKey, string[]> = {
  root: ['root'],
  panel: ['panel'],
  panelHeader: ['panelHeader'],
  panelBody: ['panelBody'],
  panelFooter: ['panelFooter'],
  trigger: ['trigger'],
  analyzePanel: ['analyzePanel'],
  analyzePanelHeader: ['analyzePanelHeader'],
  analyzeMenu: ['analyzeMenu'],
  analyzeMenuTrigger: ['analyzeMenuTrigger'],
  analyzeMenuResult: ['analyzeMenuResult'],
  receipt: ['receipt'],
  receiptClause: ['receiptClause'],
  stepHistory: ['stepHistory'],
  stepHistoryItem: ['stepHistoryItem'],
  answerBanner: ['answerBanner'],
  proactiveChip: ['proactiveChip'],
  focusBreadcrumb: ['focusBreadcrumb'],
};

export const useChartCopilotUtilityClasses = (
  classes: Partial<ChartCopilotClasses> | undefined,
): ChartCopilotClasses => composeClasses(slots, getChartCopilotUtilityClass, classes);
