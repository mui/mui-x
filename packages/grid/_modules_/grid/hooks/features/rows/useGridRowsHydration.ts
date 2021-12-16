import * as React from 'react';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { GridEvents } from '../../../models/events/gridEvents';
import { useGridState } from '../../utils/useGridState';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridComponentProps } from '../../../GridComponentProps';
import { getCurrentPageRows } from '../../utils/useCurrentPageRows';
import { gridDensityRowHeightSelector } from '../density/densitySelector';
import { GridPreProcessingGroup } from '../../core/preProcessing';
import { GridEventListener } from '../../../models/events/gridEventListener';

/**
 * @requires useGridRowGroupsPreProcessing (method)
 * @requires useGridPageSize (method)
 * @requires useGridPage (method)
 */
export const useGridRowsHydration = (
  apiRef: GridApiRef,
  props: Pick<GridComponentProps, 'pagination' | 'paginationMode'>,
) => {
  const [gridState, setGridState, forceUpdate] = useGridState(apiRef);

  const hydrateRowsMeta = React.useCallback(() => {
    const { rows } = getCurrentPageRows(apiRef.current.state, {
      pagination: props.pagination,
      paginationMode: props.paginationMode,
    });

    const rowHeight = gridDensityRowHeightSelector(apiRef.current.state);

    setGridState((state) => {
      const positions: number[] = [];
      const totalHeight = rows.reduce((acc: number, row) => {
        positions.push(acc);

        const heights = apiRef.current.unstable_applyPreProcessors(
          GridPreProcessingGroup.rowHeight,
          { base: rowHeight }, // We use an object to make simple to check if a size was already added or not
          row,
        ) as Record<string, number>;

        const finalRowHeight = Object.values(heights).reduce((acc2, value) => acc2 + value, 0);

        return acc + finalRowHeight;
      }, 0);

      return {
        ...state,
        rows: {
          ...state.rows,
          meta: { totalHeight, positions },
        },
      };
    });
    forceUpdate();
  }, [apiRef, props.pagination, props.paginationMode, setGridState, forceUpdate]);

  const handlePreProcessorRegister = React.useCallback<
    GridEventListener<GridEvents.preProcessorRegister>
  >(
    (name) => {
      if (name === GridPreProcessingGroup.rowHeight) {
        hydrateRowsMeta();
      }
    },
    [hydrateRowsMeta],
  );

  // The effect is used to build the rows meta data - totalHeight and positions.
  // Because of variable row height this is needed for the virtualization
  React.useEffect(() => {
    hydrateRowsMeta();
  }, [
    gridState.density,
    gridState.filter,
    gridState.pagination,
    gridState.sorting,
    hydrateRowsMeta,
  ]);

  useGridApiEventHandler(apiRef, GridEvents.preProcessorRegister, handlePreProcessorRegister);
};
