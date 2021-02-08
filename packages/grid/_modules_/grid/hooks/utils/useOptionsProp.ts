import * as React from 'react';
import { DEFAULT_LOCALE_TEXT } from '../../constants/localeTextConstants';
import { GridComponentProps, GridOptionsProp } from '../../GridComponentProps';
import { ApiRef } from '../../models/api/apiRef';
import { DEFAULT_GRID_OPTIONS, GridOptions } from '../../models/gridOptions';
import { mergeOptions } from '../../utils/mergeUtils';
import { useGridReducer } from '../features/core/useGridReducer';

// REDUCER
export function optionsReducer(
  state: GridOptions,
  action: { type: string; payload?: Partial<GridOptions> },
) {
  switch (action.type) {
    case 'options::UPDATE':
      return mergeOptions(state, action.payload);
    default:
      throw new Error(`Material-UI: Action ${action.type} not found.`);
  }
}

export function useOptionsProp(apiRef: ApiRef, props: GridComponentProps): GridOptions {
  const options: GridOptionsProp = React.useMemo(
    () => ({
      ...props,
      localeText: { ...DEFAULT_LOCALE_TEXT, ...props.localeText },
    }),
    [props],
  );

  const { gridState, dispatch } = useGridReducer(apiRef, 'options', optionsReducer, {
    ...DEFAULT_GRID_OPTIONS,
  });

  const updateOptions = React.useCallback(
    (newOptions: Partial<GridOptions>) => {
      dispatch({ type: 'options::UPDATE', payload: newOptions });
    },
    [dispatch],
  );

  React.useEffect(() => {
    updateOptions(options);
  }, [options, updateOptions]);

  return gridState.options;
}
