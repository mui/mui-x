import type { GridRowId } from '@mui/x-data-grid-pro';
import type { CommandHandler } from '../types';

interface StartCellParams {
  id: GridRowId;
  field: string;
}

interface StopCellParams {
  id: GridRowId;
  field: string;
  ignoreModifications?: boolean;
}

interface SetCellValueParams {
  id: GridRowId;
  field: string;
  value: unknown;
  debounceMs?: number;
}

export const editingStartCell: CommandHandler<StartCellParams> = {
  type: 'editing.startCell',
  namespace: 'editing',
  tier: 3,
  plan: 'community',
  guard: 'mutations',
  phase: 'view',
  run: ({ id, field }, ctx) => {
    ctx.apiRef.current.startCellEditMode({ id, field });
  },
};

export const editingStopCell: CommandHandler<StopCellParams> = {
  type: 'editing.stopCell',
  namespace: 'editing',
  tier: 3,
  plan: 'community',
  guard: 'mutations',
  phase: 'view',
  run: ({ id, field, ignoreModifications }, ctx) => {
    ctx.apiRef.current.stopCellEditMode({ id, field, ignoreModifications });
  },
};

export const editingSetCellValue: CommandHandler<SetCellValueParams> = {
  type: 'editing.setCellValue',
  namespace: 'editing',
  tier: 3,
  plan: 'community',
  guard: 'mutations',
  phase: 'view',
  run: ({ id, field, value, debounceMs }, ctx) => {
    ctx.apiRef.current.setEditCellValue({ id, field, value, debounceMs } as any);
  },
};

export const editingCommands: CommandHandler[] = [
  editingStartCell,
  editingStopCell,
  editingSetCellValue,
];
