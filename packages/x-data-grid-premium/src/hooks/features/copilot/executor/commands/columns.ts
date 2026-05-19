import type { CommandHandler } from '../types';

interface AutosizeParams {
  options?: any;
}

interface UpdateColumnsParams {
  columns: Record<string, unknown>[];
}

export const columnsAutosize: CommandHandler<AutosizeParams> = {
  type: 'columns.autosize',
  namespace: 'columns',
  tier: 2,
  plan: 'community',
  guard: null,
  phase: 'layout',
  run: (params, ctx) => {
    return ctx.apiRef.current.autosizeColumns(params?.options);
  },
};

export const columnsUpdate: CommandHandler<UpdateColumnsParams> = {
  type: 'columns.update',
  namespace: 'columns',
  tier: 3,
  plan: 'community',
  guard: 'mutations',
  phase: 'view',
  run: ({ columns }, ctx) => {
    ctx.apiRef.current.updateColumns(columns as any);
  },
};

export const columnsCommands: CommandHandler[] = [columnsAutosize, columnsUpdate];
