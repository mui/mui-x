import { GridColumnLookup, GridColumnsState, GridColumnsRawState } from './gridColumnsState';
import {
  DEFAULT_GRID_COL_TYPE_KEY,
  getGridDefaultColumnTypes,
  GRID_STRING_COL_DEF,
  GridApiRef,
  GridColDef,
  GridColType,
  GridColumnTypesRecord,
  GridStateColDef,
} from '../../../models';
import { GridPreProcessingGroup } from '../../core/preProcessing';
import { gridColumnsSelector } from './gridColumnsSelector';

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

export const hydrateColumnsWidth = (
  rawState: GridColumnsRawState,
  viewportInnerWidth: number,
): GridColumnsState => {
  const columnsLookup: GridColumnLookup = {};

  let totalFlexUnits = 0;
  let widthToAllocateInFlex = viewportInnerWidth;

  // Compute the width of non-flex columns and how much width must be allocated between the flex columns
  rawState.all.forEach((columnField) => {
    const newColumn = { ...rawState.lookup[columnField] } as GridStateColDef;
    if (newColumn.hide) {
      newColumn.computedWidth = 0;
    } else {
      const minWidth = newColumn.minWidth ?? GRID_STRING_COL_DEF.minWidth!;
      let computedWidth: number;
      if (newColumn.flex && newColumn.flex > 0) {
        totalFlexUnits += newColumn.flex;
        computedWidth = minWidth;
      } else {
        computedWidth = Math.max(newColumn.width ?? GRID_STRING_COL_DEF.width!, minWidth);
      }

      widthToAllocateInFlex -= computedWidth;
      newColumn.computedWidth = computedWidth;
    }

    columnsLookup[columnField] = newColumn;
  });

  // Compute the width of flex columns
  if (totalFlexUnits > 0 && widthToAllocateInFlex > 0) {
    const widthPerFlexUnit = widthToAllocateInFlex / totalFlexUnits;
    rawState.all.forEach((columnField) => {
      const column = columnsLookup[columnField];

      if (!column.hide && column.flex && column.flex > 0) {
        columnsLookup[columnField].computedWidth += widthPerFlexUnit * column.flex;
      }
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
