import * as React from 'react';
import {
  GridColumnLookup,
  GridColumnsState,
  GridColumnsRawState,
  GridColumnVisibilityModel,
  GridColumnRawLookup,
  GridColumnsInitialState,
} from './gridColumnsInterfaces';
import {
  DEFAULT_GRID_COL_TYPE_KEY,
  getGridDefaultColumnTypes,
  GridColType,
  GridColumnTypesRecord,
} from '../../../models';
import { GridStateCommunity } from '../../../models/gridStateCommunity';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridColDef, GridStateColDef } from '../../../models/colDef/gridColDef';
import { gridColumnsSelector, gridColumnVisibilityModelSelector } from './gridColumnsSelector';
import { clamp } from '../../../utils/utils';

export const COLUMNS_DIMENSION_PROPERTIES = ['maxWidth', 'minWidth', 'width', 'flex'] as const;

export type GridColumnDimensionProperties = typeof COLUMNS_DIMENSION_PROPERTIES[number];

export const computeColumnTypes = (customColumnTypes: GridColumnTypesRecord = {}) => {
  const mergedColumnTypes: GridColumnTypesRecord = { ...getGridDefaultColumnTypes() };

  Object.entries(customColumnTypes).forEach(([colType, colTypeDef]) => {
    if (mergedColumnTypes[colType]) {
      mergedColumnTypes[colType] = {
        ...mergedColumnTypes[colType],
        ...colTypeDef,
      };
    } else {
      mergedColumnTypes[colType] = {
        ...mergedColumnTypes[colTypeDef.extendType || DEFAULT_GRID_COL_TYPE_KEY],
        ...colTypeDef,
      };
    }
  });

  return mergedColumnTypes;
};

/**
 * Computes width for flex columns.
 * Based on CSS Flexbox specification:
 * https://drafts.csswg.org/css-flexbox-1/#resolve-flexible-lengths
 */
export function computeFlexColumnsWidth({
  initialFreeSpace,
  totalFlexUnits,
  flexColumns,
}: {
  initialFreeSpace: number;
  totalFlexUnits: number;
  flexColumns: {
    field: GridColDef['field'];
    flex?: number;
    minWidth?: number;
    maxWidth?: number;
  }[];
}) {
  const flexColumnsLookup: {
    all: Record<
      GridColDef['field'],
      {
        flex: number;
        computedWidth: number;
        frozen: boolean;
      }
    >;
    frozenFields: GridColDef['field'][];
    freeze: (field: GridColDef['field']) => void;
  } = {
    all: {},
    frozenFields: [],
    freeze: (field: GridColDef['field']) => {
      const value = flexColumnsLookup.all[field];
      if (value && value.frozen !== true) {
        flexColumnsLookup.all[field].frozen = true;
        flexColumnsLookup.frozenFields.push(field);
      }
    },
  };

  // Step 5 of https://drafts.csswg.org/css-flexbox-1/#resolve-flexible-lengths
  function loopOverFlexItems() {
    // 5a: If all the flex items on the line are frozen, free space has been distributed.
    if (flexColumnsLookup.frozenFields.length === flexColumns.length) {
      return;
    }

    const violationsLookup: {
      min: Record<GridColDef['field'], boolean>;
      max: Record<GridColDef['field'], boolean>;
    } = { min: {}, max: {} };

    let remainingFreeSpace = initialFreeSpace;
    let flexUnits = totalFlexUnits;
    let totalViolation = 0;

    // 5b: Calculate the remaining free space
    flexColumnsLookup.frozenFields.forEach((field) => {
      remainingFreeSpace -= flexColumnsLookup.all[field].computedWidth;
      flexUnits -= flexColumnsLookup.all[field].flex!;
    });
    for (let i = 0; i < flexColumns.length; i += 1) {
      const column = flexColumns[i];

      if (
        flexColumnsLookup.all[column.field] &&
        flexColumnsLookup.all[column.field].frozen === true
      ) {
        // eslint-disable-next-line no-continue
        continue;
      }

      // 5c: Distribute remaining free space proportional to the flex factors
      const widthPerFlexUnit = remainingFreeSpace / flexUnits;

      let computedWidth = widthPerFlexUnit * column.flex!;

      // 5d: Fix min/max violations
      if (computedWidth < column.minWidth!) {
        totalViolation += column.minWidth! - computedWidth;
        computedWidth = column.minWidth!;
        violationsLookup.min[column.field] = true;
      } else if (computedWidth > column.maxWidth!) {
        totalViolation += column.maxWidth! - computedWidth;
        computedWidth = column.maxWidth!;
        violationsLookup.max[column.field] = true;
      }

      flexColumnsLookup.all[column.field] = {
        frozen: false,
        computedWidth,
        flex: column.flex!,
      };
    }

    // 5e: Freeze over-flexed items
    if (totalViolation < 0) {
      // Freeze all the items with max violations
      Object.keys(violationsLookup.max).forEach((field) => {
        flexColumnsLookup.freeze(field);
      });
    } else if (totalViolation > 0) {
      // Freeze all the items with min violations
      Object.keys(violationsLookup.min).forEach((field) => {
        flexColumnsLookup.freeze(field);
      });
    } else {
      // Freeze all items
      flexColumns.forEach(({ field }) => {
        flexColumnsLookup.freeze(field);
      });
    }

    // 5f: Return to the start of this loop
    loopOverFlexItems();
  }

  loopOverFlexItems();

  return flexColumnsLookup.all;
}

/**
 * Compute the `computedWidth` (ie: the width the column should have during rendering) based on the `width` / `flex` / `minWidth` / `maxWidth` properties of `GridColDef`.
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
    if (rawState.columnVisibilityModel[columnField] === false) {
      newColumn.computedWidth = 0;
    } else {
      let computedWidth: number;
      if (newColumn.flex && newColumn.flex > 0) {
        totalFlexUnits += newColumn.flex;
        computedWidth = 0;
        flexColumns.push(newColumn);
      } else {
        computedWidth = clamp(newColumn.width!, newColumn.minWidth!, newColumn.maxWidth!);
      }

      widthAllocatedBeforeFlex += computedWidth;
      newColumn.computedWidth = computedWidth;
    }

    columnsLookup[columnField] = newColumn;
  });

  const initialFreeSpace = Math.max(viewportInnerWidth - widthAllocatedBeforeFlex, 0);

  // Allocate the remaining space to the flex columns
  if (totalFlexUnits > 0 && viewportInnerWidth > 0) {
    const computedColumnWidths = computeFlexColumnsWidth({
      initialFreeSpace,
      totalFlexUnits,
      flexColumns,
    });

    Object.keys(computedColumnWidths).forEach((field) => {
      columnsLookup[field].computedWidth = computedColumnWidths[field].computedWidth;
    });
  }

  return {
    ...rawState,
    lookup: columnsLookup,
  };
};

let columnTypeWarnedOnce = false;

/**
 * Apply the order and the dimensions of the initial state.
 * The columns not registered in `orderedFields` will be placed after the imported columns.
 */
export const applyInitialState = (
  columnsState: Omit<GridColumnsRawState, 'columnVisibilityModel'>,
  initialState: GridColumnsInitialState | undefined,
) => {
  if (!initialState) {
    return columnsState;
  }

  const { orderedFields = [], dimensions = {} } = initialState;

  const columnsWithUpdatedDimensions = Object.keys(dimensions);
  if (columnsWithUpdatedDimensions.length === 0 && orderedFields.length === 0) {
    return columnsState;
  }

  const orderedFieldsLookup: Record<string, true> = {};
  const cleanOrderedFields: string[] = [];

  for (let i = 0; i < orderedFields.length; i += 1) {
    const field = orderedFields[i];

    // Ignores the fields in the initialState that matches no field on the current column state
    if (columnsState.lookup[field]) {
      orderedFieldsLookup[field] = true;
      cleanOrderedFields.push(field);
    }
  }

  const newOrderedFields =
    cleanOrderedFields.length === 0
      ? columnsState.all
      : [...cleanOrderedFields, ...columnsState.all.filter((field) => !orderedFieldsLookup[field])];

  const newColumnLookup: GridColumnRawLookup = { ...columnsState.lookup };
  for (let i = 0; i < columnsWithUpdatedDimensions.length; i += 1) {
    const field = columnsWithUpdatedDimensions[i];
    newColumnLookup[field] = {
      ...newColumnLookup[field],
      ...dimensions[field],
      hasBeenResized: true,
    };
  }

  const newColumnsState: Omit<GridColumnsRawState, 'columnVisibilityModel'> = {
    all: newOrderedFields,
    lookup: newColumnLookup,
  };

  return newColumnsState;
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

  if (process.env.NODE_ENV !== 'production') {
    if (!columnTypeWarnedOnce && !columnTypes[type]) {
      console.warn(
        [
          `MUI: The column type "${type}" you are using is not supported.`,
          `Column type "string" is being used instead.`,
        ].join('\n'),
      );
      columnTypeWarnedOnce = true;
    }
  }

  if (!columnTypes[type]) {
    return columnTypes[DEFAULT_GRID_COL_TYPE_KEY];
  }

  return columnTypes[type];
};

export const createColumnsState = ({
  apiRef,
  columnsToUpsert,
  initialState,
  columnsTypes,
  currentColumnVisibilityModel = gridColumnVisibilityModelSelector(apiRef),
  shouldRegenColumnVisibilityModelFromColumns,
  keepOnlyColumnsToUpsert = false,
}: {
  columnsToUpsert: GridColDef[];
  initialState: GridColumnsInitialState | undefined;
  columnsTypes: GridColumnTypesRecord;
  currentColumnVisibilityModel?: GridColumnVisibilityModel;
  shouldRegenColumnVisibilityModelFromColumns: boolean;
  keepOnlyColumnsToUpsert: boolean;
  apiRef: React.MutableRefObject<GridApiCommunity>;
}) => {
  const isInsideStateInitializer = !apiRef.current.state.columns;

  let columnsStateWithoutColumnVisibilityModel: Omit<
    GridColumnsRawState,
    'columnVisibilityModel' | 'lookup'
  > & {
    lookup: { [field: string]: Omit<GridStateColDef, 'computedWidth'> };
  };
  if (isInsideStateInitializer || keepOnlyColumnsToUpsert) {
    columnsStateWithoutColumnVisibilityModel = {
      all: [],
      lookup: {},
    };
  } else {
    const currentState = gridColumnsSelector(apiRef.current.state);
    columnsStateWithoutColumnVisibilityModel = {
      all: [...currentState.all],
      lookup: { ...currentState.lookup },
    };
  }

  const columnsToUpsertLookup: Record<string, true> = {};
  columnsToUpsert.forEach((newColumn) => {
    columnsToUpsertLookup[newColumn.field] = true;
    if (columnsStateWithoutColumnVisibilityModel.lookup[newColumn.field] == null) {
      // New Column
      columnsStateWithoutColumnVisibilityModel.lookup[newColumn.field] = {
        ...getGridColDef(columnsTypes, newColumn.type), // TODO v6: Inline `getGridColDef`
        ...newColumn,
      };
      columnsStateWithoutColumnVisibilityModel.all.push(newColumn.field);
    } else {
      const mergedColumn = {
        ...columnsStateWithoutColumnVisibilityModel.lookup[newColumn.field],
        ...newColumn,
      };

      if (
        !mergedColumn.hasBeenResized &&
        COLUMNS_DIMENSION_PROPERTIES.some((propertyName) => newColumn[propertyName] !== undefined)
      ) {
        mergedColumn.hasBeenResized = true;
      }

      columnsStateWithoutColumnVisibilityModel.lookup[newColumn.field] = mergedColumn;
    }
  });

  const columnsLookupBeforePreProcessing = { ...columnsStateWithoutColumnVisibilityModel.lookup };

  const columnsStateWithPreProcessing: Omit<GridColumnsRawState, 'columnVisibilityModel'> =
    apiRef.current.unstable_applyPipeProcessors(
      'hydrateColumns',
      columnsStateWithoutColumnVisibilityModel,
    );

  // TODO v6: remove the sync between the columns `hide` option and the model.
  let columnVisibilityModel: GridColumnVisibilityModel = {};
  if (shouldRegenColumnVisibilityModelFromColumns) {
    let hasModelChanged = false;

    const newColumnVisibilityModel = { ...currentColumnVisibilityModel };
    if (isInsideStateInitializer) {
      columnsStateWithPreProcessing.all.forEach((field) => {
        newColumnVisibilityModel[field] =
          !columnsStateWithoutColumnVisibilityModel.lookup[field].hide;
      });
    } else if (keepOnlyColumnsToUpsert) {
      // At this point, `keepOnlyColumnsToUpsert` has a new meaning: keep the columns
      // passed via `columnToUpsert` + columns added by the pre-processors. We do the following
      // cleanup because a given column may have been removed from the `columns` prop but it still
      // exists in the state.
      Object.keys(newColumnVisibilityModel).forEach((field) => {
        if (!columnsStateWithPreProcessing.lookup[field]) {
          delete newColumnVisibilityModel[field];
          hasModelChanged = true;
        }
      });
    }

    columnsStateWithPreProcessing.all.forEach((field) => {
      // If neither the `columnsToUpsert` nor the pre-processors updated the column,
      // Then we don't want to update the visibility status of the column in the model.
      if (
        !columnsToUpsertLookup[field] &&
        columnsLookupBeforePreProcessing[field] === columnsStateWithPreProcessing.lookup[field]
      ) {
        return;
      }

      // We always assume that a column not in the model is visible by default. However, there's an
      // edge case where the column is not in the model but it also doesn't exist in the `columns`
      // prop, meaning that the column is being added. In that case, we assume that the column was
      // not visible before for it be added to the model.
      let isVisibleBefore = currentColumnVisibilityModel[field];
      if (isVisibleBefore === undefined) {
        if (isInsideStateInitializer) {
          isVisibleBefore = true;
        } else {
          const currentState = gridColumnsSelector(apiRef.current.state);
          isVisibleBefore = !!currentState.lookup[field];
        }
      }

      const isVisibleAfter = !columnsStateWithPreProcessing.lookup[field].hide;

      if (isVisibleAfter !== isVisibleBefore) {
        hasModelChanged = true;

        newColumnVisibilityModel[field] = isVisibleAfter;
      }
    });

    if (hasModelChanged || isInsideStateInitializer) {
      columnVisibilityModel = newColumnVisibilityModel;
    } else {
      columnVisibilityModel = currentColumnVisibilityModel;
    }
  } else {
    columnVisibilityModel = currentColumnVisibilityModel;
  }

  const columnsStateWithPortableColumns = applyInitialState(
    columnsStateWithPreProcessing,
    initialState,
  );

  const columnsState: GridColumnsRawState = {
    ...columnsStateWithPortableColumns,
    columnVisibilityModel,
  };

  return hydrateColumnsWidth(
    columnsState,
    apiRef.current.getRootDimensions?.()?.viewportInnerSize.width ?? 0,
  );
};

export const mergeColumnsState =
  (columnsState: GridColumnsState) =>
  (state: GridStateCommunity): GridStateCommunity => ({
    ...state,
    columns: columnsState,
  });
