'use client';
import type { CopilotPlugin, CopilotPluginContext } from '../core';
import {
  evaluateFormula,
  type FormulaEvalContext,
  type FormulaScope,
} from '../../formula-engine';
import { CopilotFormulaAnswer } from './CopilotFormulaAnswer';

export const FORMULA_PLUGIN_ID = 'formula' as const;
export const ANSWER_WITH_FORMULA_TOOL_NAME = 'answerWithFormula' as const;

export interface FormulaPluginOptions<TApi = unknown> {
  /** Override the claimed tool name. Defaults to `answerWithFormula`. */
  toolName?: string;
  /**
   * Build a {@link FormulaEvalContext} from the plugin's runtime context.
   * The host supplies this so the engine stays decoupled from any concrete
   * row/column model. The Grid binds it to its `apiRef`-backed data source.
   */
  buildEvalContext(ctx: CopilotPluginContext<TApi>, scope: FormulaScope): FormulaEvalContext;
}

interface FormulaToolInput {
  title?: string;
  formula?: string;
  scope?: 'filtered' | 'all';
}

/**
 * Opt-in Copilot plugin that handles client-side formula evaluation.
 *
 * The model emits `answerWithFormula` with an Excel-like formula expression;
 * the plugin parses and evaluates it locally against a host-supplied data
 * source (no row data leaves the browser) and writes the scalar result back
 * as a `tool-output-available` chunk.
 */
export function formulaPlugin<TApi = unknown>(
  options: FormulaPluginOptions<TApi>,
): CopilotPlugin<TApi> {
  const toolName = options.toolName ?? ANSWER_WITH_FORMULA_TOOL_NAME;
  return {
    id: FORMULA_PLUGIN_ID,
    toolNames: [toolName],
    toolSlots: {
      [toolName]: { root: CopilotFormulaAnswer as any },
    },
    async handleToolCall(ctx) {
      const input = ctx.input as FormulaToolInput | undefined;
      if (
        !input ||
        typeof input !== 'object' ||
        typeof input.formula !== 'string' ||
        input.formula.trim() === ''
      ) {
        await ctx.emitError('answerWithFormula.formula is missing or empty.');
        return;
      }
      const scope: FormulaScope = input.scope === 'all' ? 'all' : 'filtered';
      const title =
        typeof input.title === 'string' && input.title.trim() !== ''
          ? input.title.trim()
          : 'Result';
      const evalContext = options.buildEvalContext(ctx, scope);
      const evaluation = evaluateFormula(input.formula, evalContext);
      await ctx.emitResult({
        title,
        formula: input.formula,
        scope,
        result: evaluation.ok
          ? {
              ok: true,
              value: evaluation.value,
              rowCount: evaluation.rowCount,
              scope: evaluation.scope,
              formatField: evaluation.formatField,
            }
          : { ok: false, reason: evaluation.reason, scope: evaluation.scope },
      });
    },
  };
}

export { CopilotFormulaAnswer } from './CopilotFormulaAnswer';
