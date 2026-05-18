import type { GridRowId } from '@mui/x-data-grid-pro';
import type { CommandHandler } from '../types';

interface FetchRowsParams {
  parentId?: GridRowId;
  overrides?: Record<string, unknown>;
}

interface EditRowParams {
  id: GridRowId;
  updatedRow: Record<string, unknown>;
  previousRow?: Record<string, unknown>;
}

export const dataSourceFetchRows: CommandHandler<FetchRowsParams> = {
  type: 'dataSource.fetchRows',
  namespace: 'dataSource',
  tier: 3,
  plan: 'community',
  guard: 'mutations',
  phase: 'view',
  run: (params, ctx) => {
    const ds: any = (ctx.apiRef.current as any).dataSource;
    return ds?.fetchRows?.(params?.parentId, params?.overrides);
  },
};

export const dataSourceEditRow: CommandHandler<EditRowParams> = {
  type: 'dataSource.editRow',
  namespace: 'dataSource',
  tier: 3,
  plan: 'community',
  guard: 'mutations',
  phase: 'view',
  run: ({ id, updatedRow, previousRow }, ctx) => {
    const ds: any = (ctx.apiRef.current as any).dataSource;
    return ds?.editRow?.({ rowId: id, updatedRow, previousRow });
  },
};

export const dataSourceCommands: CommandHandler[] = [dataSourceFetchRows, dataSourceEditRow];
