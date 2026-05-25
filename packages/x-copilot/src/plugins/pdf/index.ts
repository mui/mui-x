'use client';
import type { CopilotPlugin, CopilotPluginContext } from '../core';
import { CopilotPdfReportCard } from './CopilotPdfReportCard';
import { countPdfReportPages, extractPdfReportTitle, type PdfReportToolInput } from './spec';

export const PDF_REPORT_PLUGIN_ID = 'pdf-report' as const;
export const COMPOSE_PDF_REPORT_TOOL_NAME = 'composePdfReport' as const;

export interface PdfReportPluginOptions {
  /** Override the claimed tool name. Defaults to `composePdfReport`. */
  toolName?: string;
}

/**
 * Opt-in Copilot plugin that handles client-side PDF report generation.
 *
 * The model emits `composePdfReport` with a json-render Spec that references
 * approved `queryGridData` results via `$state` / `$template` / `repeat`
 * expressions; the spec is rendered in the user's browser. No real data
 * leaves the browser.
 *
 * The PDF is built lazily on click so `$state` resolves against LIVE grid
 * state at open-time — which is what enables the "Regenerate" button to
 * pick up data changes.
 */
export function pdfReportPlugin(options: PdfReportPluginOptions = {}): CopilotPlugin {
  const toolName = options.toolName ?? COMPOSE_PDF_REPORT_TOOL_NAME;
  return {
    id: PDF_REPORT_PLUGIN_ID,
    toolNames: [toolName],
    toolSlots: {
      [toolName]: { root: CopilotPdfReportCard },
    },
    async handleToolCall(ctx: CopilotPluginContext) {
      const input = ctx.input as PdfReportToolInput | undefined;
      const tree = input?.tree;
      if (!tree || typeof tree !== 'object' || !tree.root || !tree.elements) {
        await ctx.emitError(
          'composePdfReport input must include a `tree` with `root` and `elements`. ' +
            'Did the model emit a malformed json-render spec?',
        );
        return;
      }
      await ctx.emitResult({
        title: extractPdfReportTitle(tree),
        pageCount: countPdfReportPages(tree),
        generatedAt: new Date().toISOString(),
      });
    },
  };
}

export { CopilotPdfReportCard } from './CopilotPdfReportCard';
export { buildPdfReportState } from './buildState';
export {
  countPdfReportPages,
  extractPdfReportTitle,
  type PdfReportSpec,
  type PdfReportSpecElement,
  type PdfReportToolInput,
} from './spec';
