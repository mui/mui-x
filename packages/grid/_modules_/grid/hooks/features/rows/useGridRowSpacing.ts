import * as React from 'react';
import { GridPreProcessor, useGridRegisterPreProcessor } from '../../core/preProcessing';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { useCurrentPageRows } from '../../utils/useCurrentPageRows';
import { GridRowSpacingParams } from '../../../models/params/gridRowParams';

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

  const { getRowSpacing } = props;

  const addRowSpacing = React.useCallback<GridPreProcessor<'rowHeight'>>(
    (initialValue, row) => {
      if (!getRowSpacing) {
        return initialValue;
      }

      const index = currentPage.lookup[row.id];
      const params: GridRowSpacingParams = {
        ...row,
        isFirstVisible: index === 0,
        isLastVisible: index === currentPage.rows.length - 1,
      };

      const spacing = getRowSpacing(params);
      return { ...initialValue, spacingTop: spacing.top ?? 0, spacingBottom: spacing.bottom ?? 0 };
    },
    [currentPage.lookup, currentPage.rows.length, getRowSpacing],
  );

  useGridRegisterPreProcessor(apiRef, 'rowHeight', addRowSpacing);
};
