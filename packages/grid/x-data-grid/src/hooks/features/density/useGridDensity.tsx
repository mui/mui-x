import * as React from 'react';
import { GridDensity, GridDensityTypes } from '../../../models/gridDensity';
import { useGridLogger } from '../../utils/useGridLogger';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { GridDensityApi } from '../../../models/api/gridDensityApi';
import { GridDensityState } from './densityState';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { gridDensitySelector } from './densitySelector';
import { isDeepEqual } from '../../../utils/utils';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
import { useGridSelector } from '../../utils/useGridSelector';
import { gridVisibleColumnDefinitionsSelector } from '../columns';
import { unwrapGroupingColumnModel } from '../columnGrouping/useGridColumnGrouping';
import { GridStateCommunity } from '../../../models/gridStateCommunity';

export const COMPACT_DENSITY_FACTOR = 0.7;
export const COMFORTABLE_DENSITY_FACTOR = 1.3;

// TODO v6: revise keeping headerHeight and rowHeight in state
const getUpdatedDensityState = (
  newDensity: GridDensity,
  newHeaderHeight: number,
  newRowHeight: number,
  newMaxDepth: number,
): GridDensityState => {
  switch (newDensity) {
    case GridDensityTypes.Compact:
      return {
        value: newDensity,
        headerHeight: Math.floor(newHeaderHeight * COMPACT_DENSITY_FACTOR),
        rowHeight: Math.floor(newRowHeight * COMPACT_DENSITY_FACTOR),
        headerGroupingMaxDepth: newMaxDepth,
        factor: COMPACT_DENSITY_FACTOR,
      };
    case GridDensityTypes.Comfortable:
      return {
        value: newDensity,
        headerHeight: Math.floor(newHeaderHeight * COMFORTABLE_DENSITY_FACTOR),
        rowHeight: Math.floor(newRowHeight * COMFORTABLE_DENSITY_FACTOR),
        headerGroupingMaxDepth: newMaxDepth,
        factor: COMFORTABLE_DENSITY_FACTOR,
      };
    default:
      return {
        value: newDensity,
        headerHeight: newHeaderHeight,
        rowHeight: newRowHeight,
        headerGroupingMaxDepth: newMaxDepth,
        factor: 1,
      };
  }
};

export const densityStateInitializer: GridStateInitializer<
  Pick<DataGridProcessedProps, 'density' | 'headerHeight' | 'rowHeight' | 'columnGroupingModel'>
> = (state, props) => {
  // TODO: think about improving this initialization. Could it be done in the useColumn initializer?
  // TODO: manage to remove ts-ignore
  let maxDepth: number;
  if (props.columnGroupingModel == null || Object.keys(props.columnGroupingModel).length === 0) {
    maxDepth = 0;
  } else {
    const unwrappedGroupingColumnModel = unwrapGroupingColumnModel(props.columnGroupingModel);

    const columnsState = state.columns as GridStateCommunity['columns'];
    const visibleColumns = columnsState.all.filter(
      (field) => columnsState.columnVisibilityModel[field] !== false,
    );

    if (visibleColumns.length === 0) {
      maxDepth = 0;
    } else {
      maxDepth = Math.max(
        ...visibleColumns.map((field) => unwrappedGroupingColumnModel[field!]?.length ?? 0),
      );
    }
  }
  return {
    ...state,
    density: getUpdatedDensityState(props.density, props.headerHeight, props.rowHeight, maxDepth),
  };
};

export const useGridDensity = (
  apiRef: React.MutableRefObject<GridApiCommunity>,
  props: Pick<DataGridProcessedProps, 'headerHeight' | 'rowHeight' | 'density'>,
): void => {
  const visibleColumns = useGridSelector(apiRef, gridVisibleColumnDefinitionsSelector);

  const maxDepth =
    visibleColumns.length > 0
      ? Math.max(...visibleColumns.map((column) => column.groupPath?.length ?? 0))
      : 0;

  const logger = useGridLogger(apiRef, 'useDensity');

  const setDensity = React.useCallback<GridDensityApi['setDensity']>(
    (
      newDensity,
      newHeaderHeight = props.headerHeight,
      newRowHeight = props.rowHeight,
      newMaxDepth = maxDepth,
    ): void => {
      logger.debug(`Set grid density to ${newDensity}`);
      apiRef.current.setState((state) => {
        const currentDensityState = gridDensitySelector(state);
        const newDensityState = getUpdatedDensityState(
          newDensity,
          newHeaderHeight,
          newRowHeight,
          newMaxDepth,
        );

        if (isDeepEqual(currentDensityState, newDensityState)) {
          return state;
        }

        return {
          ...state,
          density: newDensityState,
        };
      });
      apiRef.current.forceUpdate();
    },
    [logger, apiRef, props.headerHeight, props.rowHeight, maxDepth],
  );

  React.useEffect(() => {
    apiRef.current.setDensity(props.density, props.headerHeight, props.rowHeight, maxDepth);
  }, [apiRef, props.density, props.rowHeight, props.headerHeight, maxDepth]);

  const densityApi: GridDensityApi = {
    setDensity,
  };

  useGridApiMethod(apiRef, densityApi, 'GridDensityApi');
};
