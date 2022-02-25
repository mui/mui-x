import * as React from 'react';
import { GridPreProcessor, useGridRegisterPreProcessor } from '@mui/x-data-grid/internals';
import {
  GRID_TREE_DATA_GROUPING_COL_DEF,
  GRID_TREE_DATA_GROUPING_COL_DEF_FORCED_PROPERTIES,
} from './gridTreeDataGroupColDef';
import { GridColDef } from '../../../models/gridColDef';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { TREE_DATA_GROUPING_NAME } from './useGridTreeData';
import { GridApiPro } from '../../../models/gridApiPro';
import {
  GridGroupingColDefOverride,
  GridGroupingColDefOverrideParams,
} from '../../../models/gridGroupingColDefOverride';
import { GridTreeDataGroupingCell } from '../../../components';

export const useGridTreeDataPreProcessors = (
  apiRef: React.MutableRefObject<GridApiPro>,
  props: Pick<DataGridProProcessedProps, 'treeData' | 'groupingColDef'>,
) => {
  const getGroupingColDef = React.useCallback((): GridColDef => {
    const groupingColDefProp = props.groupingColDef;

    let colDefOverride: GridGroupingColDefOverride | null | undefined;
    if (typeof groupingColDefProp === 'function') {
      const params: GridGroupingColDefOverrideParams = {
        groupingName: TREE_DATA_GROUPING_NAME,
        fields: [],
      };

      colDefOverride = groupingColDefProp(params);
    } else {
      colDefOverride = groupingColDefProp;
    }

    const { hideDescendantCount, ...colDefOverrideProperties } = colDefOverride ?? {};

    const commonProperties: Omit<GridColDef, 'field' | 'editable'> = {
      ...GRID_TREE_DATA_GROUPING_COL_DEF,
      renderCell: (params) => (
        <GridTreeDataGroupingCell {...params} hideDescendantCount={hideDescendantCount} />
      ),
      headerName: apiRef.current.getLocaleText('treeDataGroupingHeaderName'),
    };

    return {
      ...commonProperties,
      ...colDefOverrideProperties,
      ...GRID_TREE_DATA_GROUPING_COL_DEF_FORCED_PROPERTIES,
    };
  }, [apiRef, props.groupingColDef]);

  const updateGroupingColumn = React.useCallback<GridPreProcessor<'hydrateColumns'>>(
    (columnsState) => {
      const groupingColDefField = GRID_TREE_DATA_GROUPING_COL_DEF_FORCED_PROPERTIES.field;

      const shouldHaveGroupingColumn = props.treeData;
      const prevGroupingColumn = columnsState.lookup[groupingColDefField];

      if (shouldHaveGroupingColumn) {
        const newGroupingColumn = getGroupingColDef();
        if (prevGroupingColumn) {
          newGroupingColumn.width = prevGroupingColumn.width;
          newGroupingColumn.flex = prevGroupingColumn.flex;
        }
        columnsState.lookup[groupingColDefField] = newGroupingColumn;
        if (prevGroupingColumn == null) {
          const index = columnsState.all[0] === '__check__' ? 1 : 0;
          columnsState.all = [
            ...columnsState.all.slice(0, index),
            groupingColDefField,
            ...columnsState.all.slice(index),
          ];
        }
      } else if (!shouldHaveGroupingColumn && prevGroupingColumn) {
        delete columnsState.lookup[groupingColDefField];
        columnsState.all = columnsState.all.filter((field) => field !== groupingColDefField);
      }

      return columnsState;
    },
    [props.treeData, getGroupingColDef],
  );

  useGridRegisterPreProcessor(apiRef, 'hydrateColumns', updateGroupingColumn);
};
