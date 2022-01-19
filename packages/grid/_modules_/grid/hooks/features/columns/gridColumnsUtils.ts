import {
  GridColumnLookup,
  GridColumnsState,
  GridColumnsRawState,
  GridColumnVisibilityModel,
} from './gridColumnsInterfaces';
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
import { gridColumnsSelector, gridColumnVisibilityModelSelector } from './gridColumnsSelector';

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
    if (rawState.columnVisibilityModel[columnField] === false) {
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

      if (rawState.columnVisibilityModel[columnField] !== false && column.flex && column.flex > 0) {
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

  columnsToUpsert.forEach((newColumn) => {
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
