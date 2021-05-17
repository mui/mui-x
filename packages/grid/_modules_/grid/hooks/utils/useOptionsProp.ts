import * as React from 'react';
import { ownerDocument } from '@material-ui/core/utils';
import { GRID_DEFAULT_LOCALE_TEXT } from '../../constants/localeTextConstants';
import { mergeGridOptions } from '../../utils/mergeUtils';
import { GridComponentProps, GridOptionsProp } from '../../GridComponentProps';
import { GridApiRef } from '../../models/api/gridApiRef';
import { DEFAULT_GRID_OPTIONS, GridOptions } from '../../models/gridOptions';
import { composeClasses, getScrollbarSize, useEnhancedEffect } from '../../utils/material-ui-utils';
import { useGridReducer } from '../features/core/useGridReducer';
import { useLogger } from './useLogger';
import { getDataGridUtilityClass } from '../../utils/utils';
import {
  GRID_CELL_CSS_CLASS_SUFFIX,
  GRID_COLUMN_HEADER_CSS_CLASS_SUFFIX,
  GRID_ROOT_CSS_CLASS_SUFFIX,
  GRID_ROW_CSS_CLASS_SUFFIX,
} from '../../constants/cssClassesConstants';

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
  const [browserScrollBar, setBrowserScrollBar] = React.useState(0);

  const getBrowserScrollBar = React.useCallback(() => {
    if (apiRef.current?.rootElementRef?.current) {
      const doc = ownerDocument(apiRef.current.rootElementRef!.current as HTMLElement);
      const scrollbarSize = getScrollbarSize(doc);
      logger.debug(`Detected Scroll Bar size ${scrollbarSize}.`);
      return scrollbarSize;
    }
    return 0;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiRef, logger, apiRef.current?.rootElementRef?.current]);

  useEnhancedEffect(() => {
    setBrowserScrollBar(getBrowserScrollBar());
  }, [getBrowserScrollBar]);

  const options: GridOptionsProp = React.useMemo(
    () => ({
      ...props,
      classes: composeClasses(
        {
          root: [GRID_ROOT_CSS_CLASS_SUFFIX],
          columnHeader: [GRID_COLUMN_HEADER_CSS_CLASS_SUFFIX],
          row: [GRID_ROW_CSS_CLASS_SUFFIX],
          cell: [GRID_CELL_CSS_CLASS_SUFFIX],
        },
        getDataGridUtilityClass,
        props.classes as Record<string, string>,
      ),
      localeText: { ...GRID_DEFAULT_LOCALE_TEXT, ...props.localeText },
      scrollbarSize: props.scrollbarSize == null ? browserScrollBar : props.scrollbarSize || 0,
    }),
    [browserScrollBar, props],
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
