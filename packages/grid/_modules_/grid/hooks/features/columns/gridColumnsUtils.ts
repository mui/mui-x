import {
  GridColumnLookup,
  GridColumnsState,
  GridColumnsRawState,
  GridColumnVisibilityModel,
} from './gridColumnsInterfaces';
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
import { gridColumnsSelector, gridColumnVisibilityModelSelector } from './gridColumnsSelector';
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
  apiRef,
  columnsToUpsert,
  columnsTypes,
  currentColumnVisibilityModel = gridColumnVisibilityModelSelector(apiRef.current.state),
  shouldRegenColumnVisibilityModelFromColumns,
  reset,
}: {
  apiRef: GridApiRef;
  columnsToUpsert: GridColDef[];
  columnsTypes: GridColumnTypesRecord;
  currentColumnVisibilityModel?: GridColumnVisibilityModel;
  shouldRegenColumnVisibilityModelFromColumns: boolean;
  reset: boolean;
}) => {
  let columnsStateWithoutColumnVisibilityModel: Omit<GridColumnsRawState, 'columnVisibilityModel'>;
  if (reset) {
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
      columnsStateWithoutColumnVisibilityModel.lookup[newColumn.field] = {
        ...columnsStateWithoutColumnVisibilityModel.lookup[newColumn.field],
        ...newColumn,
      };
    }
  });

  const columnsLookupBeforePreProcessing = { ...columnsStateWithoutColumnVisibilityModel.lookup };

  const columnsStateWithPreProcessing: Omit<GridColumnsRawState, 'columnVisibilityModel'> =
    apiRef.current.unstable_applyPreProcessors(
      GridPreProcessingGroup.hydrateColumns,
      columnsStateWithoutColumnVisibilityModel,
    );

  // TODO v6: remove the sync between the columns `hide` option and the model.
  let columnVisibilityModel: GridColumnVisibilityModel = {};
  if (shouldRegenColumnVisibilityModelFromColumns) {
    if (reset) {
      columnsStateWithPreProcessing.all.forEach((field) => {
        columnVisibilityModel[field] = !columnsStateWithoutColumnVisibilityModel.lookup[field].hide;
      });
    } else {
      const newColumnVisibilityModel = { ...currentColumnVisibilityModel };
      let hasModelChanged = false;

      columnsStateWithPreProcessing.all.forEach((field) => {
        // If neither the `columnsToUpsert` nor the pre-processors updated the column,
        // Then we don't want to update the visibility status of the column in the model.
        if (
          !columnsToUpsertLookup[field] &&
          columnsLookupBeforePreProcessing[field] === columnsStateWithPreProcessing.lookup[field]
        ) {
          return;
        }

        const isVisibleBefore = currentColumnVisibilityModel[field] ?? true;
        const isVisibleAfter = !columnsStateWithPreProcessing.lookup[field].hide;

        if (isVisibleAfter !== isVisibleBefore) {
          hasModelChanged = true;

          newColumnVisibilityModel[field] = isVisibleAfter;
        }
      });

      if (hasModelChanged) {
        columnVisibilityModel = newColumnVisibilityModel;
      } else {
        columnVisibilityModel = currentColumnVisibilityModel;
      }
    }
  } else {
    columnVisibilityModel = currentColumnVisibilityModel;
  }

  const columnsState: GridColumnsRawState = {
    ...columnsStateWithPreProcessing,
    columnVisibilityModel,
  };

  return hydrateColumnsWidth(
    columnsState,
    apiRef.current.getRootDimensions?.()?.viewportInnerSize.width ?? 0,
  );
};
