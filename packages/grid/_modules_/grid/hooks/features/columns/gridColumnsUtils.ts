import {
  GridColumnLookup,
  GridColumnsState,
  GridColumnsRawState,
  GridVisibleColumnsModel,
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
import {
  gridColumnsSelector,
  gridVisibleColumnsModelSelector,
  gridVisibleColumnsModelLookupSelector,
} from './gridColumnsSelector';

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
  const visibleColumnsModelLookup = rawState.visibleColumnsModel.reduce((acc, el) => {
    acc[el] = true;
    return acc;
  }, {});

  let totalFlexUnits = 0;
  let widthToAllocateInFlex = viewportInnerWidth;

  // Compute the width of non-flex columns and how much width must be allocated between the flex columns
  rawState.all.forEach((columnField) => {
    const newColumn = { ...rawState.lookup[columnField] } as GridStateColDef;
    if (!visibleColumnsModelLookup[columnField]) {
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
  apiRef,
  columnsToUpsert,
  columnsTypes,
  currentVisibleColumnsModel = gridVisibleColumnsModelSelector(apiRef.current.state),
  shouldRegenVisibleColumnsModelFromColumns,
  reset,
}: {
  apiRef: GridApiRef;
  columnsToUpsert: GridColDef[];
  columnsTypes: GridColumnTypesRecord;
  currentVisibleColumnsModel?: GridVisibleColumnsModel;
  shouldRegenVisibleColumnsModelFromColumns: boolean;
  reset: boolean;
}) => {
  let columnsStateWithoutVisibleColumnsModel: Omit<GridColumnsRawState, 'visibleColumnsModel'>;
  if (reset) {
    columnsStateWithoutVisibleColumnsModel = {
      all: [],
      lookup: {},
    };
  } else {
    const currentState = gridColumnsSelector(apiRef.current.state);
    columnsStateWithoutVisibleColumnsModel = {
      all: [...currentState.all],
      lookup: { ...currentState.lookup },
    };
  }

  columnsToUpsert.forEach((newColumn) => {
    if (columnsStateWithoutVisibleColumnsModel.lookup[newColumn.field] == null) {
      // New Column
      columnsStateWithoutVisibleColumnsModel.lookup[newColumn.field] = {
        ...getGridColDef(columnsTypes, newColumn.type), // TODO v6: Inline `getGridColDef`
        ...newColumn,
      };
      columnsStateWithoutVisibleColumnsModel.all.push(newColumn.field);
    } else {
      columnsStateWithoutVisibleColumnsModel.lookup[newColumn.field] = {
        ...columnsStateWithoutVisibleColumnsModel.lookup[newColumn.field],
        ...newColumn,
      };
    }
  });

  const columnsStateWithPreProcessing: Omit<GridColumnsRawState, 'visibleColumnsModel'> =
    apiRef.current.unstable_applyPreProcessors(
      GridPreProcessingGroup.hydrateColumns,
      columnsStateWithoutVisibleColumnsModel,
    );

  // TODO: In v6 remove the sync between the columns `hide` option and the model.
  let visibleColumnsModel: GridVisibleColumnsModel;
  if (shouldRegenVisibleColumnsModelFromColumns) {
    if (reset) {
      visibleColumnsModel = columnsStateWithPreProcessing.all.filter(
        (field) => !columnsStateWithPreProcessing.lookup[field].hide,
      );
    } else {
      const currentVisibleColumnsModelLookup = gridVisibleColumnsModelLookupSelector(
        apiRef.current.state,
      );
      const newVisibleColumnsModelLookup = { ...currentVisibleColumnsModelLookup };
      let hasModelChanged = false;

      columnsStateWithPreProcessing.all.forEach((field) => {
        const isVisibleBefore = currentVisibleColumnsModelLookup[field];
        const isVisibleAfter = !columnsStateWithPreProcessing.lookup[field].hide;

        if (isVisibleAfter !== isVisibleBefore) {
          hasModelChanged = true;

          if (isVisibleAfter) {
            newVisibleColumnsModelLookup[field] = true;
          } else {
            delete newVisibleColumnsModelLookup[field];
          }
        }
      });

      if (hasModelChanged) {
        visibleColumnsModel = Object.keys(newVisibleColumnsModelLookup);
      } else {
        visibleColumnsModel = currentVisibleColumnsModel;
      }
    }
  } else {
    visibleColumnsModel = currentVisibleColumnsModel;
  }

  const columnsState: GridColumnsRawState = {
    ...columnsStateWithPreProcessing,
    visibleColumnsModel,
  };

  return hydrateColumnsWidth(
    columnsState,
    apiRef.current.getRootDimensions?.()?.viewportInnerSize.width ?? 0,
  );
};
