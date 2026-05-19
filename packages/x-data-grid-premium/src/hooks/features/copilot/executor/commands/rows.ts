import type { GridRowId } from '@mui/x-data-grid-pro';
import type { CommandHandler } from '../types';

interface ChildrenExpansionParams {
  id: GridRowId;
  isExpanded: boolean;
}

interface DetailPanelsParams {
  ids: GridRowId[];
}

interface ToggleDetailPanelParams {
  id: GridRowId;
}

interface UpdateRowsParams {
  updates: Record<string, unknown>[];
}

interface SetRowsParams {
  rows: Record<string, unknown>[];
}

interface SetRowIndexParams {
  id: GridRowId;
  targetIndex: number;
}

interface SetRowPositionParams {
  sourceId: GridRowId;
  targetId: GridRowId;
  position: 'top' | 'bottom';
}

export const rowsSetChildrenExpansion: CommandHandler<ChildrenExpansionParams> = {
  type: 'rows.setChildrenExpansion',
  namespace: 'rows',
  tier: 2,
  plan: 'pro',
  guard: null,
  phase: 'selection',
  run: ({ id, isExpanded }, ctx) => {
    ctx.apiRef.current.setRowChildrenExpansion(id, isExpanded);
  },
};

export const rowsExpandAll: CommandHandler<void> = {
  type: 'rows.expandAll',
  namespace: 'rows',
  tier: 2,
  plan: 'pro',
  guard: null,
  phase: 'selection',
  run: (_, ctx) => {
    (ctx.apiRef.current as any).expandAllRows?.();
  },
};

export const rowsCollapseAll: CommandHandler<void> = {
  type: 'rows.collapseAll',
  namespace: 'rows',
  tier: 2,
  plan: 'pro',
  guard: null,
  phase: 'selection',
  run: (_, ctx) => {
    (ctx.apiRef.current as any).collapseAllRows?.();
  },
};

export const rowsSetExpandedDetailPanels: CommandHandler<DetailPanelsParams> = {
  type: 'rows.setExpandedDetailPanels',
  namespace: 'rows',
  tier: 2,
  plan: 'pro',
  guard: null,
  phase: 'selection',
  run: ({ ids }, ctx) => {
    (ctx.apiRef.current as any).setExpandedDetailPanels?.(new Set(ids));
  },
};

export const rowsToggleDetailPanel: CommandHandler<ToggleDetailPanelParams> = {
  type: 'rows.toggleDetailPanel',
  namespace: 'rows',
  tier: 2,
  plan: 'pro',
  guard: null,
  phase: 'selection',
  run: ({ id }, ctx) => {
    (ctx.apiRef.current as any).toggleDetailPanel?.(id);
  },
};

export const rowsUpdate: CommandHandler<UpdateRowsParams> = {
  type: 'rows.update',
  namespace: 'rows',
  tier: 3,
  plan: 'community',
  guard: 'mutations',
  phase: 'view',
  run: ({ updates }, ctx) => {
    ctx.apiRef.current.updateRows(updates as any);
  },
};

export const rowsSet: CommandHandler<SetRowsParams> = {
  type: 'rows.set',
  namespace: 'rows',
  tier: 3,
  plan: 'community',
  guard: 'mutations',
  phase: 'view',
  run: ({ rows }, ctx) => {
    ctx.apiRef.current.setRows(rows as any);
  },
};

export const rowsSetIndex: CommandHandler<SetRowIndexParams> = {
  type: 'rows.setIndex',
  namespace: 'rows',
  tier: 3,
  plan: 'pro',
  guard: 'mutations',
  phase: 'view',
  run: ({ id, targetIndex }, ctx) => {
    (ctx.apiRef.current as any).setRowIndex?.(id, targetIndex);
  },
};

export const rowsSetPosition: CommandHandler<SetRowPositionParams> = {
  type: 'rows.setPosition',
  namespace: 'rows',
  tier: 3,
  plan: 'pro',
  guard: 'mutations',
  phase: 'view',
  run: ({ sourceId, targetId, position }, ctx) => {
    (ctx.apiRef.current as any).setRowPosition?.(sourceId, targetId, position);
  },
};

export const rowsCommands: CommandHandler[] = [
  rowsSetChildrenExpansion,
  rowsExpandAll,
  rowsCollapseAll,
  rowsSetExpandedDetailPanels,
  rowsToggleDetailPanel,
  rowsUpdate,
  rowsSet,
  rowsSetIndex,
  rowsSetPosition,
];
