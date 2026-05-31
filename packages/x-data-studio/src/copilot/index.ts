// State document + host adapter
export { snapshotState, type StudioStateDocument, type SheetDoc, type DataSourceDoc } from './stateDocument';
export {
  createStudioHostAdapter,
  type StudioHostAdapter,
  type StudioCopilotApi,
  type StudioToolStopContext,
} from './studioHostAdapter';

// Guards
export {
  buildStudioGuards,
  DEFAULT_STUDIO_GUARDS,
  type StudioGuards,
} from './guards';

// Command + patch packs (and the underlying handler arrays for testing)
export { studioCommandPack, studioReconcilerPack } from './studioPacks';
export { ALL_STUDIO_COMMAND_HANDLERS } from './commands';
export { ALL_STUDIO_PATCH_HANDLERS } from './reconcilers';

// Hook
export {
  useStudioCopilot,
  type UseStudioCopilotOptions,
  type UseStudioCopilotReturn,
} from './useStudioCopilot';

// Local storage adapter
export {
  createStudioCopilotLocalStorageAdapter,
  getStudioCopilotLocalStorageAdapterController,
  type StudioCopilotLocalStorageAdapterOptions,
  type StudioCopilotLocalStorageAdapterController,
} from './createStudioCopilotLocalStorageAdapter';

// Panel UI + Context
export { StudioCopilotPanel, type StudioCopilotPanelProps } from './StudioCopilotPanel';
export {
  StudioCopilotProvider,
  useStudioCopilotControls,
  type StudioCopilotProviderProps,
} from './StudioCopilotContext';

// Data query
export {
  QUERY_STUDIO_DATA_TOOL_NAME,
  createQueryStudioDataProvider,
  type StudioDataQueryInput,
  type StudioDataQueryResult,
  type StudioDataQueryColumnMeta,
} from './dataQuery';

// Plugins (Studio-flavored)
export {
  studioFormulaPlugin,
  createStudioFormulaDataSource,
} from './formula';
export {
  studioPdfReportPlugin,
  COMPOSE_PDF_REPORT_TOOL_NAME,
  PDF_REPORT_PLUGIN_ID,
  CopilotPdfReportCard,
  buildPdfReportState,
  countPdfReportPages,
  extractPdfReportTitle,
  type PdfReportPluginOptions,
  type PdfReportSpec,
  type PdfReportSpecElement,
  type PdfReportToolInput,
} from './pdf';
