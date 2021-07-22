import {
  getGridColDef,
  getGridDefaultColumnTypes,
  GRID_STRING_COL_DEF,
  gridCheckboxSelectionColDef,
  GridColDef,
  GridColumnLookup,
  GridColumns,
  GridColumnTypesRecord,
  GridColumnsState,
  GridLocaleText,
  GridStateColDef,
  GridTranslationKeys,
  Logger,
} from '../../../models';
import { mergeGridColTypes } from '../../../utils';

export type RawGridColumnsState = Omit<GridColumnsState, 'lookup'> & {
  lookup: { [field: string]: GridColDef | GridStateColDef };
};

export function getGridStateColDefList(
  columns: (GridColDef | GridStateColDef)[],
  viewportWidth: number,
): GridStateColDef[] {
  const numberOfFluidColumns = columns.filter((column) => !!column.flex && !column.hide).length;
  let flexDivider = 0;

  if (numberOfFluidColumns && viewportWidth) {
    columns.forEach((column) => {
      if (!column.hide) {
        if (!column.flex) {
          viewportWidth -= Math.max(column.minWidth!, column.width!);
        } else {
          flexDivider += column.flex;
        }
      }
    });
  }

  const flexMultiplier = flexDivider > 0 ? viewportWidth / flexDivider : 0;

  return columns.map((column) => {
    const width = column.width ?? 0

    let computedWidth: number

    if (column.flex && viewportWidth > 0) {
      const flexColumnWidth = Math.floor(flexMultiplier * column.flex);
      computedWidth = Math.max(width, flexColumnWidth)
    } else {
      computedWidth = width
    }

    computedWidth = Math.max(computedWidth, column.minWidth ?? GRID_STRING_COL_DEF.minWidth!)

    return {
      ...column,
      computedWidth,
    };
  });
}

export function hydrateColumns(
  columns: GridColumns,
  columnTypes: GridColumnTypesRecord,
  withCheckboxSelection: boolean,
  logger: Logger,
  getLocaleText: <T extends GridTranslationKeys>(key: T) => GridLocaleText[T],
): GridColumns {
  logger.debug('Hydrating GridColumns with default definitions');
  const mergedColTypes = mergeGridColTypes(getGridDefaultColumnTypes(), columnTypes);
  const extendedColumns = columns.map((c) => ({ ...getGridColDef(mergedColTypes, c.type), ...c }));

  if (withCheckboxSelection) {
    const checkboxSelection = { ...gridCheckboxSelectionColDef };
    checkboxSelection.headerName = getLocaleText('checkboxSelectionHeaderName');
    return [checkboxSelection, ...extendedColumns];
  }

  return extendedColumns;
}

export function toLookup(logger: Logger, allColumns: GridStateColDef[]): GridColumnLookup {
  logger.debug('Building columns lookup');
  return allColumns.reduce((lookup, col) => {
    lookup[col.field] = col;
    return lookup;
  }, {});
}

export const upsertColumnsState = (
  columnUpdates: GridColDef[],
  prevColumnsState?: GridColumnsState,
) => {
  const newState: RawGridColumnsState = {
    all: [...(prevColumnsState?.all ?? [])],
    lookup: { ...(prevColumnsState?.lookup ?? {}) },
  };

  columnUpdates.forEach((newColumn) => {
    if (newState.lookup[newColumn.field] == null) {
      // New Column
      newState.lookup[newColumn.field] = newColumn;
      newState.all.push(newColumn.field);
    } else {
      newState.lookup[newColumn.field] = { ...newState.lookup[newColumn.field], ...newColumn };
    }
  });

  return newState;
};
