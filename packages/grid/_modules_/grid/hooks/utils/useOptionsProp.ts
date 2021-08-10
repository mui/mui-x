import * as React from 'react';
import { GRID_DEFAULT_LOCALE_TEXT } from '../../constants/localeTextConstants';
import { mergeGridOptions } from '../../utils/mergeUtils';
import { GridComponentProps, GridOptionsProp } from '../../GridComponentProps';
import { GridApiRef } from '../../models/api/gridApiRef';
import { DEFAULT_GRID_OPTIONS, GridOptions } from '../../models/gridOptions';
import { composeClasses } from '../../utils/material-ui-utils';
import { useGridReducer } from '../features/core/useGridReducer';
import { useLogger } from './useLogger';
import { getDataGridUtilityClass } from '../../utils/utils';

// REDUCER
export function optionsReducer(
  state: GridOptions,
  action: { type: string; payload?: Partial<GridOptions> },
) {
  switch (action.type) {
    case 'options::UPDATE':
      return mergeGridOptions(state, action.payload);
    default:
      throw new Error(`Material-UI: Action ${action.type} not found.`);
  }
}
export function useOptionsProp(apiRef: GridApiRef, props: GridComponentProps): GridOptions {
  const logger = useLogger('useOptionsProp');

  const options: GridOptionsProp = React.useMemo(
    () => ({
      ...props,
      classes: composeClasses(
        {
          root: ['root'],
          columnHeader: ['columnHeader'],
          row: ['row'],
          cell: ['cell'],
        },
        getDataGridUtilityClass,
        props.classes as Record<string, string>,
      ),
      localeText: { ...GRID_DEFAULT_LOCALE_TEXT, ...props.localeText },
    }),
    [props],
  );

  const { gridState, dispatch } = useGridReducer(apiRef, 'options', optionsReducer, {
    ...DEFAULT_GRID_OPTIONS,
  });

  const updateOptions = React.useCallback(
    (newOptions: Partial<GridOptions>) => {
      logger.debug('updating options state.');
      dispatch({ type: 'options::UPDATE', payload: newOptions });
    },
    [dispatch, logger],
  );

  React.useEffect(() => {
    updateOptions(options);
  }, [options, updateOptions]);

  return gridState.options;
}
