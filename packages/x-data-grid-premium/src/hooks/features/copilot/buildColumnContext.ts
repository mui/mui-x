import type { GridColDef, GridSingleSelectColDef } from '@mui/x-data-grid-pro';
import { getValueOptions } from '@mui/x-data-grid/internals';

/**
 * Static, state-independent portion of the Copilot column context — the
 * shape the backend's `ColumnContextSchema` accepts for each entry of
 * `gridContext.columns`. Callers layer on the state-dependent fields
 * (`visible`, `pinned`, `examples`, `width`, `group`) themselves.
 *
 * For enum columns (any column with `valueOptions` defined — `singleSelect`
 * today, future `multiSelect` types likewise) the helper resolves
 * function-valued options and forwards the canonical array so the model
 * never has to guess casing.
 */
export interface CopilotColumnContextBase {
  field: string;
  headerName?: string;
  description?: string | null;
  type: string;
  allowedOperators: string[];
  valueOptions?: Array<string | number | { value: unknown; label?: string }>;
}

type EnumLikeColDef = Pick<GridSingleSelectColDef, 'field' | 'valueOptions'>;

function isEnumLikeCol(col: GridColDef): col is GridColDef & EnumLikeColDef {
  return (col as Partial<EnumLikeColDef>).valueOptions !== undefined;
}

/**
 * Build the static column-context the Copilot ships to the backend for one
 * column. Use this in your `buildGridContext` to ensure the model receives
 * accurate `valueOptions` for enum columns.
 */
export function buildCopilotColumnContext(col: GridColDef): CopilotColumnContextBase {
  const base: CopilotColumnContextBase = {
    field: col.field,
    headerName: col.headerName,
    description: col.description ?? null,
    type: col.type ?? 'string',
    allowedOperators: (col.filterOperators ?? []).map((op) => op.value),
  };

  if (isEnumLikeCol(col)) {
    const resolved = getValueOptions(col as GridSingleSelectColDef);
    if (resolved && resolved.length > 0) {
      base.valueOptions = resolved as CopilotColumnContextBase['valueOptions'];
    }
  }

  return base;
}
