import * as React from 'react';
import { debounce } from '@material-ui/core/utils';
import { GridEvents } from '../../constants/eventsConstants';
import { ElementSize, GridEventsApi } from '../../models';
import { useGridApiEventHandler, useGridApiOptionHandler } from '../root/useGridApiEventHandler';
import { useGridApiMethod } from '../root/useGridApiMethod';
import { useLogger } from './useLogger';
import { GridComponentProps } from '../../GridComponentProps';

const isTestEnvironment = process.env.NODE_ENV === 'test';

export function useResizeContainer(
  apiRef,
  props: Pick<GridComponentProps, 'autoHeight' | 'rows' | 'onResize'>,
) {
  const gridLogger = useLogger('useResizeContainer');
  const warningShown = React.useRef(false);

  const resizeFn = React.useCallback(() => {
    gridLogger.debug(`resizing...`);

    apiRef.current.publishEvent(GridEvents.debouncedResize, {
      containerSize: apiRef.current.state.containerSizes?.windowSizes,
    });
  }, [apiRef, gridLogger]);

  const eventsApi: GridEventsApi = { resize: resizeFn };
  useGridApiMethod(apiRef, eventsApi, 'GridEventsApi');

  const debounceResize = React.useMemo(() => debounce(resizeFn, 60), [resizeFn]);

  const handleResize = React.useCallback(
    (size: ElementSize) => {
      // jsdom has no layout capabilities
      const isJSDOM = /jsdom/.test(window.navigator.userAgent);

      if (size.height === 0 && !warningShown.current && !props.autoHeight && !isJSDOM) {
        gridLogger.warn(
          [
            'The parent of the grid has an empty height.',
            'You need to make sure the container has an intrinsic height.',
            'The grid displays with a height of 0px.',
            '',
            'You can find a solution in the docs:',
            'https://material-ui.com/components/data-grid/layout/',
          ].join('\n'),
        );
        warningShown.current = true;
      }
      if (size.width === 0 && !warningShown.current && !isJSDOM) {
        gridLogger.warn(
          [
            'The parent of the grid has an empty width.',
            'You need to make sure the container has an intrinsic width.',
            'The grid displays with a width of 0px.',
            '',
            'You can find a solution in the docs:',
            'https://material-ui.com/components/data-grid/layout/',
          ].join('\n'),
        );
        warningShown.current = true;
      }

      if (isTestEnvironment) {
        // We don't need to debounce the resize for tests.
        resizeFn();
        return;
      }

      debounceResize();
    },
    [props.autoHeight, debounceResize, gridLogger, resizeFn],
  );

  React.useEffect(() => {
    return () => {
      gridLogger.info('canceling resize...');
      debounceResize.clear();
    };
  }, [gridLogger, debounceResize]);

  React.useEffect(() => {
    gridLogger.info('canceling resize...');
    debounceResize.clear();
  }, [props.rows, debounceResize, gridLogger]);

  useGridApiEventHandler(apiRef, GridEvents.resize, handleResize);
  useGridApiOptionHandler(apiRef, GridEvents.debouncedResize, props.onResize);
}
