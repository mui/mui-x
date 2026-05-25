import type { GridRowModel } from '@mui/x-data-grid';
import {
  createDataStudioSyntheticGroupId,
  DATA_STUDIO_CHILDREN_COUNT_FIELD,
  DATA_STUDIO_GROUP_KEY_FIELD,
  DATA_STUDIO_SYNTHETIC_ID_FIELD,
} from './synthesis';

function normalizeDataStudioDbValue(value: unknown) {
  if (typeof value !== 'string' || value.trim() === '') {
    return value;
  }

  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : value;
}

export function normalizeDataStudioDbRow(row: GridRowModel): GridRowModel {
  return Object.fromEntries(
    Object.entries(row).map(([field, value]) => [field, normalizeDataStudioDbValue(value)]),
  );
}

function getDataStudioLeafGroupKey(row: GridRowModel, rowIdField: string | undefined) {
  return row[rowIdField ?? 'id'] ?? row.id ?? row[DATA_STUDIO_SYNTHETIC_ID_FIELD];
}

export function hydrateDataStudioLeafRows(
  rows: GridRowModel[],
  rowIdField?: string,
): GridRowModel[] {
  return rows.map((row) => {
    const normalizedRow = normalizeDataStudioDbRow(row);

    return {
      ...normalizedRow,
      [DATA_STUDIO_GROUP_KEY_FIELD]: getDataStudioLeafGroupKey(normalizedRow, rowIdField),
    };
  });
}

export function hydrateDataStudioGroupRows(
  rows: GridRowModel[],
  groupFields: string[],
  groupKeys: string[],
  rowIdField?: string,
) {
  return rows.map((row) => {
    const groupKey = String(row[DATA_STUDIO_GROUP_KEY_FIELD] ?? '');
    const nextGroupKeys = groupKeys.concat(groupKey);
    const id = createDataStudioSyntheticGroupId(groupFields, nextGroupKeys);
    const existingRowId = row[rowIdField ?? 'id'];

    // Only set the visible rowIdField when the DB row already provided a value
    // (rare for synthetic group rows). The client picks the synthetic id from
    // `__dataStudioSyntheticId` via `getRowId`, so we never want to leak the
    // synthetic id into the visible row-id column.
    return normalizeDataStudioDbRow({
      ...row,
      [DATA_STUDIO_GROUP_KEY_FIELD]: groupKey,
      [DATA_STUDIO_CHILDREN_COUNT_FIELD]: Number(row[DATA_STUDIO_CHILDREN_COUNT_FIELD] ?? 0),
      [DATA_STUDIO_SYNTHETIC_ID_FIELD]: id,
      ...(existingRowId != null ? { [rowIdField ?? 'id']: existingRowId } : {}),
    });
  });
}
