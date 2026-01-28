'use client';
import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import {
  useIsCellEditable as useIsCellEditableCommunity,
  CellEditableConditionFn,
} from '@mui/x-data-grid-pro/internals';
import { GridPrivateApiPremium } from '../../../models/gridApiPremium';
import { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { gridAggregationModelSelector } from '../aggregation/gridAggregationSelectors';

/**
 * Implementation of the cell editable condition hook of the Data Grid Premium
 */
export const useIsCellEditable = (
  apiRef: RefObject<GridPrivateApiPremium>,
  props: DataGridPremiumProcessedProps,
): CellEditableConditionFn => {
  const isCellEditableCommunity = useIsCellEditableCommunity();
  return React.useCallback(
    (params) => {
      const isCellEditable = isCellEditableCommunity(params);

      // If the cell is not editable by the community hook, return false immediately
      if (!isCellEditable) {
        return false;
      }

      // If the data source is not used or aggregation is disabled or both tree data and row grouping are disabled, return the community hook result
      if (
        !props.dataSource ||
        props.disableAggregation ||
        (!props.treeData && props.disableRowGrouping)
      ) {
        return isCellEditable;
      }

      // If the cell is not a part of the aggregation model, return the community hook result
      const aggregationModelFields = Object.keys(gridAggregationModelSelector(apiRef));
      if (!aggregationModelFields.includes(params.field)) {
        return isCellEditable;
      }

      // The cell is a part of the aggregation model and it is retrieved from the server-side data.
      // Allow editing only for the non-grouped rows.
      return params.rowNode.type !== 'group';
    },
    [
      apiRef,
      props.dataSource,
      props.treeData,
      props.disableAggregation,
      props.disableRowGrouping,
      isCellEditableCommunity,
    ],
  );
};
