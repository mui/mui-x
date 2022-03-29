import * as React from 'react';
import { GridCallbackDetails, GridValidRowModel } from '@mui/x-data-grid-pro';
import {
  GridExperimentalProFeatures,
  DataGridProPropsWithDefaultValue,
  DataGridProPropsWithoutDefaultValue,
  DataGridPropsWithComplexDefaultValueAfterProcessing,
  DataGridPropsWithComplexDefaultValueBeforeProcessing,
} from '@mui/x-data-grid-pro/internals';
import type { GridRowGroupingModel } from '../hooks/features/rowGrouping';
import { GridInitialStatePremium } from './gridStatePremium';
import { GridApiPremium } from './gridApiPremium';

export interface GridExperimentalPremiumFeatures extends GridExperimentalProFeatures {}

/**
 * The props users can give to the `DataGridProProps` component.
 */
export interface DataGridPremiumProps<R extends GridValidRowModel = any>
  extends Omit<
    Partial<DataGridPremiumPropsWithDefaultValue> &
      DataGridPropsWithComplexDefaultValueBeforeProcessing &
      DataGridPremiumPropsWithoutDefaultValue<R>,
    DataGridPremiumForcedPropsKey
  > {
  /**
   * Features under development.
   * For each feature, if the flag is not explicitly set to `true`, the feature will be fully disabled and any property / method call will not have any effect.
   */
  experimentalFeatures?: Partial<GridExperimentalPremiumFeatures>;
}

/**
 * The props of the `DataGridPremium` component after the pre-processing phase.
 */
export interface DataGridPremiumProcessedProps
  extends DataGridPremiumPropsWithDefaultValue,
    DataGridPropsWithComplexDefaultValueAfterProcessing,
    DataGridPremiumPropsWithoutDefaultValue {}

export type DataGridPremiumForcedPropsKey = 'signature';

/**
 * The `DataGridPremium` options with a default value overridable through props
 * None of the entry of this interface should be optional, they all have default values and `DataGridProps` already applies a `Partial<DataGridSimpleOptions>` for the public interface
 * The controlled model do not have a default value at the prop processing level, so they must be defined in `DataGridOtherProps`
 */
export interface DataGridPremiumPropsWithDefaultValue extends DataGridProPropsWithDefaultValue {
  /**
   * If `true`, the row grouping is disabled.
   * @default false
   */
  disableRowGrouping: boolean;
  /**
   * If `single`, all column we are grouping by will be represented in the same grouping the same column.
   * If `multiple`, each column we are grouping by will be represented in its own column.
   * @default 'single'
   */
  rowGroupingColumnMode: 'single' | 'multiple';
}

export interface DataGridPremiumPropsWithoutDefaultValue<R extends GridValidRowModel = any>
  extends Omit<DataGridProPropsWithoutDefaultValue<R>, 'initialState' | 'apiRef'> {
  /**
   * The ref object that allows grid manipulation. Can be instantiated with [[useGridApiRef()]].
   */
  apiRef?: React.MutableRefObject<GridApiPremium>;
  /**
   * The initial state of the DataGridPremium.
   * The data in it will be set in the state on initialization but will not be controlled.
   * If one of the data in `initialState` is also being controlled, then the control state wins.
   */
  initialState?: GridInitialStatePremium;
  /**
   * Set the row grouping model of the grid.
   */
  rowGroupingModel?: GridRowGroupingModel;
  /**
   * Callback fired when the row grouping model changes.
   * @param {GridRowGroupingModel} model Columns used as grouping criteria.
   * @param {GridCallbackDetails} details Additional details for this callback.
   */
  onRowGroupingModelChange?: (model: GridRowGroupingModel, details: GridCallbackDetails) => void;
}
