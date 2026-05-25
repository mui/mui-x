/**
 * Studio's PDF plugin export. Today this is a direct re-export of the
 * host-agnostic `pdfReportPlugin` — its rendering reads `queryResults`
 * + `api` from `useCopilotPluginRenderContext`, which Studio populates
 * via the same provider Grid uses. No host-specific buildState shim is
 * needed.
 */
export {
  pdfReportPlugin as studioPdfReportPlugin,
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
} from '@mui/x-copilot/plugins/pdf';
