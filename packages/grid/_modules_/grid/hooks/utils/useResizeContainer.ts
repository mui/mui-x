import * as React from 'react';
import { debounce } from '@material-ui/core/utils';
import { GRID_DEBOUNCED_RESIZE, GRID_RESIZE } from '../../constants/eventsConstants';
import { ElementSize, GridEventsApi } from '../../models';
import { useGridApiEventHandler, useGridApiOptionHandler } from '../root/useGridApiEventHandler';
import { useGridApiMethod } from '../root/useGridApiMethod';
import { useLogger } from './useLogger';
import { useGridSelector } from '../features/core/useGridSelector';
import { optionsSelector } from './optionsSelector';

const isTestEnvironment = process.env.NODE_ENV === 'test';

export function useResizeContainer(apiRef) {
  const gridLogger = useLogger('useResizeContainer');
  const { autoHeight } = useGridSelector(apiRef, optionsSelector);
  const options = useGridSelector(apiRef, optionsSelector);
  const warningShown = React.useRef(false);

  const resizeFn = React.useCallback(() => {
    gridLogger.debug(`resizing...`);

    apiRef.current.publishEvent(GRID_DEBOUNCED_RESIZE, {
      containerSize: apiRef.current.getState().containerSizes?.windowSizes,
    });
  }, [apiRef, gridLogger]);

  const eventsApi: GridEventsApi = { resize: resizeFn };
  useGridApiMethod(apiRef, eventsApi, 'GridEventsApi');

  const debounceResize = React.useMemo(() => debounce(resizeFn, 60), [resizeFn]);

  const handleResize = React.useCallback(
    (size: ElementSize) => {
      // jsdom has no layout capabilities
      const isJSDOM = /jsdom/.test(window.navigator.userAgent);

      if (size.height === 0 && !warningShown.current && !autoHeight && !isJSDOM) {
        gridLogger.warn(
          [
            'The parent of the grid has an empty height.',
            'You need to make sure the container has an intrinsic height.',
            'The grid displays with a height of 0px.',
            '',
            'You can find a solution in the docs:',
            'https://material-ui.com/components/data-grid/rendering/#layout',
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
            'https://material-ui.com/components/data-grid/rendering/#layout',
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
    [autoHeight, debounceResize, gridLogger, resizeFn],
  );

  React.useEffect(() => {
    return () => {
      gridLogger.info('canceling resize...');
      debounceResize.clear();
    };
  }, [gridLogger, debounceResize]);

  useGridApiEventHandler(apiRef, GRID_RESIZE, handleResize);
  useGridApiOptionHandler(apiRef, GRID_DEBOUNCED_RESIZE, options.onResize);
}
