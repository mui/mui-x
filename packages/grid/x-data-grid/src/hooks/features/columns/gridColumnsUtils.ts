import * as React from 'react';
import {
  GridColumnLookup,
  GridColumnsState,
  GridColumnsRawState,
  GridColumnVisibilityModel,
  GridColumnRawLookup,
  GridColumnsInitialState,
} from './gridColumnsInterfaces';
import { GridColumnTypesRecord } from '../../../models';
import { DEFAULT_GRID_COL_TYPE_KEY, GRID_STRING_COL_DEF } from '../../../colDef';
import { GridStateCommunity } from '../../../models/gridStateCommunity';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridColDef, GridStateColDef } from '../../../models/colDef/gridColDef';
import { gridColumnsStateSelector, gridColumnVisibilityModelSelector } from './gridColumnsSelector';
import { clamp } from '../../../utils/utils';
import { GridApiCommon } from '../../../models/api/gridApiCommon';
import { GridRowEntry } from '../../../models/gridRows';
import { gridDensityFactorSelector } from '../density/densitySelector';
import { gridColumnGroupsHeaderMaxDepthSelector } from '../columnGrouping/gridColumnGroupsSelector';

export const COLUMNS_DIMENSION_PROPERTIES = ['maxWidth', 'minWidth', 'width', 'flex'] as const;

export type GridColumnDimensionProperties = (typeof COLUMNS_DIMENSION_PROPERTIES)[number];

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
    flex?: number | null;
    minWidth?: number;
    maxWidth?: number;
  }[];
}) {
  const uniqueFlexColumns = new Set<GridColDef['field']>(flexColumns.map((col) => col.field));
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
    if (flexColumnsLookup.frozenFields.length === uniqueFlexColumns.size) {
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
  rawState.orderedFields.forEach((columnField) => {
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
        computedWidth = clamp(
          newColumn.width || GRID_STRING_COL_DEF.width!,
          newColumn.minWidth || GRID_STRING_COL_DEF.minWidth!,
          newColumn.maxWidth || GRID_STRING_COL_DEF.maxWidth!,
        );
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

/**
 * Apply the order and the dimensions of the initial state.
 * The columns not registered in `orderedFields` will be placed after the imported columns.
 */
export const applyInitialState = (
  columnsState: GridColumnsRawState,
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
      ? columnsState.orderedFields
      : [
          ...cleanOrderedFields,
          ...columnsState.orderedFields.filter((field) => !orderedFieldsLookup[field]),
        ];

  const newColumnLookup: GridColumnRawLookup = { ...columnsState.lookup };
  for (let i = 0; i < columnsWithUpdatedDimensions.length; i += 1) {
    const field = columnsWithUpdatedDimensions[i];

    const newColDef: Omit<GridStateColDef, 'computedWidth'> = {
      ...newColumnLookup[field],
      hasBeenResized: true,
    };

    Object.entries(dimensions[field]).forEach(([key, value]) => {
      newColDef[key as GridColumnDimensionProperties] = value === -1 ? Infinity : value;
    });

    newColumnLookup[field] = newColDef;
  }

  const newColumnsState: GridColumnsRawState = {
    ...columnsState,
    orderedFields: newOrderedFields,
    lookup: newColumnLookup,
  };

  return newColumnsState;
};

function getDefaultColTypeDef(columnTypes: GridColumnTypesRecord, type: GridColDef['type']) {
  let colDef = columnTypes[DEFAULT_GRID_COL_TYPE_KEY];
  if (type && columnTypes[type]) {
    colDef = columnTypes[type];
  }
  return colDef;
}

export const createColumnsState = ({
  apiRef,
  columnsToUpsert,
  initialState,
  columnTypes,
  columnVisibilityModel = gridColumnVisibilityModelSelector(apiRef),
  keepOnlyColumnsToUpsert = false,
}: {
  columnsToUpsert: GridColDef[];
  initialState: GridColumnsInitialState | undefined;
  columnTypes: GridColumnTypesRecord;
  columnVisibilityModel?: GridColumnVisibilityModel;
  keepOnlyColumnsToUpsert: boolean;
  apiRef: React.MutableRefObject<GridApiCommunity>;
}) => {
  const isInsideStateInitializer = !apiRef.current.state.columns;

  let columnsState: Omit<GridColumnsRawState, 'lookup'> & {
    lookup: { [field: string]: Omit<GridStateColDef, 'computedWidth'> };
  };
  if (isInsideStateInitializer) {
    columnsState = {
      orderedFields: [],
      lookup: {},
      columnVisibilityModel,
    };
  } else {
    const currentState = gridColumnsStateSelector(apiRef.current.state);
    columnsState = {
      orderedFields: keepOnlyColumnsToUpsert ? [] : [...currentState.orderedFields],
      lookup: { ...currentState.lookup }, // Will be cleaned later if keepOnlyColumnsToUpsert=true
      columnVisibilityModel,
    };
  }

  let columnsToKeep: Record<string, boolean> = {};
  if (keepOnlyColumnsToUpsert && !isInsideStateInitializer) {
    columnsToKeep = Object.keys(columnsState.lookup).reduce(
      (acc, key) => ({ ...acc, [key]: false }),
      {},
    );
  }

  const columnsToUpsertLookup: Record<string, true> = {};
  columnsToUpsert.forEach((newColumn) => {
    const { field } = newColumn;
    columnsToUpsertLookup[field] = true;
    columnsToKeep[field] = true;
    let existingState = columnsState.lookup[field];

    if (existingState == null) {
      existingState = {
        ...getDefaultColTypeDef(columnTypes, newColumn.type),
        field,
        hasBeenResized: false,
      };
      columnsState.orderedFields.push(field);
    } else if (keepOnlyColumnsToUpsert) {
      columnsState.orderedFields.push(field);
    }

    // If the column type has changed - merge the existing state with the default column type definition
    if (existingState && existingState.type !== newColumn.type) {
      existingState = {
        ...existingState,
        ...getDefaultColTypeDef(columnTypes, newColumn.type),
        field,
      };
    }

    let hasBeenResized = existingState.hasBeenResized;
    COLUMNS_DIMENSION_PROPERTIES.forEach((key) => {
      if (newColumn[key] !== undefined) {
        hasBeenResized = true;

        if (newColumn[key] === -1) {
          newColumn[key] = Infinity;
        }
      }
    });

    columnsState.lookup[field] = {
      ...existingState,
      ...newColumn,
      hasBeenResized,
    };
  });

  if (keepOnlyColumnsToUpsert && !isInsideStateInitializer) {
    Object.keys(columnsState.lookup).forEach((field) => {
      if (!columnsToKeep![field]) {
        delete columnsState.lookup[field];
      }
    });
  }

  const columnsStateWithPreProcessing = apiRef.current.unstable_applyPipeProcessors(
    'hydrateColumns',
    columnsState,
  );

  const columnsStateWithPortableColumns = applyInitialState(
    columnsStateWithPreProcessing,
    initialState,
  );

  return hydrateColumnsWidth(
    columnsStateWithPortableColumns,
    apiRef.current.getRootDimensions?.()?.viewportInnerSize.width ?? 0,
  );
};

export const mergeColumnsState =
  (columnsState: GridColumnsState) =>
  (state: GridStateCommunity): GridStateCommunity => ({
    ...state,
    columns: columnsState,
  });

export function getFirstNonSpannedColumnToRender({
  firstColumnToRender,
  apiRef,
  firstRowToRender,
  lastRowToRender,
  visibleRows,
}: {
  firstColumnToRender: number;
  apiRef: React.MutableRefObject<GridApiCommon>;
  firstRowToRender: number;
  lastRowToRender: number;
  visibleRows: GridRowEntry[];
}) {
  let firstNonSpannedColumnToRender = firstColumnToRender;
  for (let i = firstRowToRender; i < lastRowToRender; i += 1) {
    const row = visibleRows[i];
    if (row) {
      const rowId = visibleRows[i].id;
      const cellColSpanInfo = apiRef.current.unstable_getCellColSpanInfo(
        rowId,
        firstColumnToRender,
      );
      if (cellColSpanInfo && cellColSpanInfo.spannedByColSpan) {
        firstNonSpannedColumnToRender = cellColSpanInfo.leftVisibleCellIndex;
      }
    }
  }

  return firstNonSpannedColumnToRender;
}

export function getFirstColumnIndexToRender({
  firstColumnIndex,
  minColumnIndex,
  columnBuffer,
  firstRowToRender,
  lastRowToRender,
  apiRef,
  visibleRows,
}: {
  firstColumnIndex: number;
  minColumnIndex: number;
  columnBuffer: number;
  apiRef: React.MutableRefObject<GridApiCommon>;
  firstRowToRender: number;
  lastRowToRender: number;
  visibleRows: GridRowEntry[];
}) {
  const initialFirstColumnToRender = Math.max(firstColumnIndex - columnBuffer, minColumnIndex);

  const firstColumnToRender = getFirstNonSpannedColumnToRender({
    firstColumnToRender: initialFirstColumnToRender,
    apiRef,
    firstRowToRender,
    lastRowToRender,
    visibleRows,
  });

  return firstColumnToRender;
}

export function getTotalHeaderHeight(
  apiRef: React.MutableRefObject<GridApiCommunity>,
  headerHeight: number,
) {
  const densityFactor = gridDensityFactorSelector(apiRef);
  const maxDepth = gridColumnGroupsHeaderMaxDepthSelector(apiRef);
  return Math.floor(headerHeight * densityFactor) * ((maxDepth ?? 0) + 1);
}
