import * as React from 'react';
import { ownerDocument } from '@material-ui/core/utils';
import { DEFAULT_LOCALE_TEXT } from '../../constants/localeTextConstants';
import { GridComponentProps, GridOptionsProp } from '../../GridComponentProps';
import { ApiRef } from '../../models/api/apiRef';
import { DEFAULT_GRID_OPTIONS, GridOptions } from '../../models/gridOptions';
import { getScrollbarSize } from '../../utils/material-ui-utils';
import { mergeOptions } from '../../utils/mergeUtils';
import { useGridReducer } from '../features/core/useGridReducer';
import { useLogger } from './useLogger';

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
let memoizedScrollBar: any = null;
export function useOptionsProp(apiRef: ApiRef, props: GridComponentProps): GridOptions {
  const logger = useLogger('useOptionsProp');

  const detectedScrollSize = React.useMemo(() => {
    if (memoizedScrollBar != null) {
      // We are using the memoized value for all grids of a document.
      return memoizedScrollBar;
    }
    if (apiRef.current?.rootElementRef?.current) {
      const doc = ownerDocument(apiRef.current.rootElementRef!.current as HTMLElement);
      memoizedScrollBar = getScrollbarSize(doc);
      logger.debug(`Detected Scroll Bar size ${memoizedScrollBar}.`);
    }
    return 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiRef, logger, apiRef.current?.rootElementRef?.current]);

  const options: GridOptionsProp = React.useMemo(
    () => ({
      ...props,
      localeText: { ...DEFAULT_LOCALE_TEXT, ...props.localeText },
      scrollbarSize: props.scrollbarSize == null ? detectedScrollSize : props.scrollbarSize || 0,
    }),
    [detectedScrollSize, props],
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
