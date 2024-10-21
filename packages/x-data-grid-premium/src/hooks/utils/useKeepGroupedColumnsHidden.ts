import * as React from 'react';
import {
  GridApi,
  GridColumnVisibilityModel,
  gridColumnVisibilityModelSelector,
} from '@mui/x-data-grid-pro';
import { GridRowGroupingModel } from '../features/rowGrouping';
import { GridInitialStatePremium } from '../../models/gridStatePremium';
import { DataGridPremiumProps } from '../../models/dataGridPremiumProps';

const updateColumnVisibilityModel = (
  columnVisibilityModel: GridColumnVisibilityModel | undefined,
  rowGroupingModel: GridRowGroupingModel | undefined,
  prevRowGroupingModel: GridRowGroupingModel | undefined,
) => {
  const newColumnVisibilityModel: GridColumnVisibilityModel = { ...columnVisibilityModel };

  rowGroupingModel?.forEach((field) => {
    if (!prevRowGroupingModel?.includes(field)) {
      newColumnVisibilityModel[field] = false;
    }
  });
  prevRowGroupingModel?.forEach((field) => {
    if (!rowGroupingModel?.includes(field)) {
      newColumnVisibilityModel[field] = true;
    }
  });

  return newColumnVisibilityModel;
};

/**
 * Automatically hide columns when added to the row grouping model and stop hiding them when they are removed.
 * Handles both the `props.initialState.rowGrouping.model` and `props.rowGroupingModel`
 * Does not work when used with the `hide` property of `GridColDef`
 */
export const useKeepGroupedColumnsHidden = (
  props: {
    apiRef: React.MutableRefObject<GridApi>;
  } & Pick<DataGridPremiumProps, 'initialState' | 'rowGroupingModel'>,
) => {
  const initialProps = React.useRef(props);
  const rowGroupingModel = React.useRef(
    props.rowGroupingModel ?? props.initialState?.rowGrouping?.model,
  );

  React.useEffect(() => {
    props.apiRef.current.subscribeEvent('rowGroupingModelChange', (newModel) => {
      const columnVisibilityModel = updateColumnVisibilityModel(
        gridColumnVisibilityModelSelector(props.apiRef),
        newModel,
        rowGroupingModel.current,
      );
      props.apiRef.current.setColumnVisibilityModel(columnVisibilityModel);
      rowGroupingModel.current = newModel;
    });
  }, [props.apiRef]);

  return React.useMemo<GridInitialStatePremium>(() => {
    const invariantInitialState = initialProps.current.initialState;
    const columnVisibilityModel = updateColumnVisibilityModel(
      invariantInitialState?.columns?.columnVisibilityModel,
      rowGroupingModel.current,
      undefined,
    );

    return {
      ...invariantInitialState,
      columns: {
        ...invariantInitialState?.columns,
        columnVisibilityModel,
      },
    };
  }, []);
};
