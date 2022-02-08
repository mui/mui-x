import * as React from 'react';
import { GridPreProcessor, useGridRegisterPreProcessor } from '../../core/preProcessing';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { useCurrentPageRows } from '../../utils/useCurrentPageRows';
import { GridRowSpacingParams } from '../../../models/params/gridRowParams';
import { GridRowId } from '../../../models/gridRows';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { GridRowSpacingApi } from '../../../models/api/gridRowApi';

/**
 * @requires useGridPage (state)
 * @requires useGridPageSize (state)
 * @requires useGridFilter (state)
 * @requires useGridColumns (state, method)
 * @requires useGridRows (state, method)
 */
export const useGridRowSpacing = (
  apiRef: GridApiRef,
  props: Pick<DataGridProcessedProps, 'getRowSpacing' | 'pagination' | 'paginationMode'>,
) => {
  const currentPage = useCurrentPageRows(apiRef, props);

  const lookup = React.useMemo(
    () =>
      currentPage.rows.reduce((acc, { id }, index) => {
        acc[id] = index;
        return acc;
      }, {} as Record<GridRowId, number>),
    [currentPage.rows],
  );

  // This method is temporarily being registered in this hook because if moved
  // to useGridRows it will be called without having the required states initialized.
  const getRowIndexRelativeToCurrentPage = React.useCallback((id) => lookup[id], [lookup]);

  const rowApi: GridRowSpacingApi = {
    unstable_getRowIndexRelativeToCurrentPage: getRowIndexRelativeToCurrentPage,
  };

  useGridApiMethod(apiRef, rowApi, 'GridRowSpacingApi');

  const { getRowSpacing } = props;

  const addRowSpacing = React.useCallback<GridPreProcessor<'rowHeight'>>(
    (initialValue, row) => {
      if (!getRowSpacing) {
        return initialValue;
      }

      const index = apiRef.current.unstable_getRowIndexRelativeToCurrentPage(row.id);
      const params: GridRowSpacingParams = {
        ...row,
        isFirstVisible: index === 0,
        isLastVisible: index === currentPage.rows.length - 1,
      };

      const spacing = getRowSpacing(params);
      return { ...initialValue, spacingTop: spacing.top ?? 0, spacingBottom: spacing.bottom ?? 0 };
    },
    [apiRef, currentPage.rows.length, getRowSpacing],
  );

  useGridRegisterPreProcessor(apiRef, 'rowHeight', addRowSpacing);
};
