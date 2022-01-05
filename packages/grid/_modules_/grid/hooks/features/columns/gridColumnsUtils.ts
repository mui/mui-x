import { GridColumnLookup, GridColumnsState, GridColumnsRawState } from './gridColumnsState';
import {
  DEFAULT_GRID_COL_TYPE_KEY,
  getGridDefaultColumnTypes,
  GridApiRef,
  GridColDef,
  GridColType,
  GridColumnTypesRecord,
  GridStateColDef,
} from '../../../models';
import { GridPreProcessingGroup } from '../../core/preProcessing';
import { gridColumnsSelector } from './gridColumnsSelector';
import { clamp } from '../../../utils/utils';

export const computeColumnTypes = (customColumnTypes: GridColumnTypesRecord = {}) => {
  const allColumnTypes = { ...getGridDefaultColumnTypes(), ...customColumnTypes };
  const mergedColumnTypes: GridColumnTypesRecord = {};

  Object.entries(allColumnTypes).forEach(([colType, colTypeDef]) => {
    colTypeDef = {
      ...allColumnTypes[colTypeDef.extendType || DEFAULT_GRID_COL_TYPE_KEY],
      ...colTypeDef,
    };
    mergedColumnTypes[colType] = colTypeDef;
  });

  return mergedColumnTypes;
};

/**
 * Compute the `computedWidth` (eg: the width the column actually have) based on the `width` / `flex` / `minWidth` / `maxWidth` properties of `GridColDef`.
 * The columns already have been merged with there `type` default values for `minWidth`, `maxWidth` and `width`, thus the `!` for those properties below.
 * TODO: Unit test this function in depth and only keep basic cases for the whole grid testing.
 * TODO: Improve the `GridColDef` typing to reflect the fact that `minWidth` / `maxWidth` and `width` can't be null after the merge with the `type` default values.
 */
export const hydrateColumnsWidth = (
  rawState: GridColumnsRawState,
  viewportInnerWidth: number,
): GridColumnsState => {
  const columnsLookup: GridColumnLookup = {};

  let totalFlexUnits = 0;
  let widthAllocatedBeforeFlex = 0;

  const flexColumns: GridStateColDef[] = [];

  // For the non-flex columns, compute their width
  // For the flex columns, compute there minimum width and how much width must be allocated during the flex allocation
  rawState.all.forEach((columnField) => {
    const newColumn = { ...rawState.lookup[columnField] } as GridStateColDef;
    if (newColumn.hide) {
      newColumn.computedWidth = 0;
    } else {
      let computedWidth: number;
      if (newColumn.flex && newColumn.flex > 0) {
        totalFlexUnits += newColumn.flex;
        computedWidth = newColumn.minWidth!;

        flexColumns.push(newColumn);
      } else {
        computedWidth = clamp(newColumn.width!, newColumn.minWidth!, newColumn.maxWidth!);
      }

      widthAllocatedBeforeFlex += computedWidth;
      newColumn.computedWidth = computedWidth;
    }

    columnsLookup[columnField] = newColumn;
  });

  // Allocate the remaining space to the flex columns
  if (totalFlexUnits > 0 && widthAllocatedBeforeFlex < viewportInnerWidth) {
    const widthPerFlexUnit = (viewportInnerWidth - widthAllocatedBeforeFlex) / totalFlexUnits;

    flexColumns.forEach((column) => {
      column.computedWidth = clamp(
        column.computedWidth + widthPerFlexUnit * column.flex!,
        column.minWidth!,
        column.maxWidth!,
      );
    });
  }

  return {
    ...rawState,
    lookup: columnsLookup,
  };
};

/**
 * @deprecated Should have been internal only, you can inline the logic.
 */
export const getGridColDef = (
  columnTypes: GridColumnTypesRecord,
  type: GridColType | undefined,
) => {
  if (!type) {
    return columnTypes[DEFAULT_GRID_COL_TYPE_KEY];
  }
  return columnTypes[type];
};

export const createColumnsState = ({
  columnsToUpsert,
  columnsTypes,
  apiRef,
  reset,
}: {
  columnsToUpsert: GridColDef[];
  columnsTypes: GridColumnTypesRecord;
  apiRef: GridApiRef;
  reset: boolean;
}) => {
  let columnsState: GridColumnsRawState;
  if (reset) {
    columnsState = {
      all: [],
      lookup: {},
    };
  } else {
    const currentState = gridColumnsSelector(apiRef.current.state);
    columnsState = {
      all: [...currentState.all],
      lookup: { ...currentState.lookup },
    };
  }

  columnsToUpsert.forEach((newColumn) => {
    if (columnsState.lookup[newColumn.field] == null) {
      // New Column
      columnsState.lookup[newColumn.field] = {
        ...getGridColDef(columnsTypes, newColumn.type), // TODO v6: Inline `getGridColDef`
        ...newColumn,
      };
      columnsState.all.push(newColumn.field);
    } else {
      columnsState.lookup[newColumn.field] = {
        ...columnsState.lookup[newColumn.field],
        ...newColumn,
      };
    }
  });

  const columnsStateWithPreProcessing = apiRef.current.unstable_applyPreProcessors(
    GridPreProcessingGroup.hydrateColumns,
    columnsState,
  );

  return hydrateColumnsWidth(
    columnsStateWithPreProcessing,
    apiRef.current.getRootDimensions?.()?.viewportInnerSize.width ?? 0,
  );
};
