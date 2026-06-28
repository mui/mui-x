import type { CopilotPlugin, CopilotPluginContext } from '@mui/x-copilot';
import { formulaPlugin, type FormulaPluginOptions } from '@mui/x-copilot/plugins/formula';
import type { StudioCopilotApi } from '../studioHostAdapter';
import { createStudioFormulaDataSource } from './studioFormulaDataSource';

export { createStudioFormulaDataSource };

/**
 * Studio-flavored Formula plugin. Wires the host-agnostic `formulaPlugin`
 * with a `FormulaDataSource` that reads from the active dataSource's static
 * rows.
 */
export function studioFormulaPlugin(
  options: Omit<FormulaPluginOptions<StudioCopilotApi>, 'buildEvalContext'> = {},
): CopilotPlugin<StudioCopilotApi> {
  return formulaPlugin<StudioCopilotApi>({
    ...options,
    buildEvalContext(ctx: CopilotPluginContext<StudioCopilotApi>, scope) {
      const api = ctx.api as StudioCopilotApi | null;
      const dataSource = api
        ? createStudioFormulaDataSource(api, scope)
        : {
            getRowIds: () => [],
            hasColumn: () => false,
            getCellValue: () => null,
          };
      return { dataSource, scope };
    },
  });
}
