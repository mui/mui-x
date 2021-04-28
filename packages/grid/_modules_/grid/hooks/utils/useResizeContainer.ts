import * as React from 'react';
import { ElementSize } from '../../models';
import { useLogger } from './useLogger';
import { useGridSelector } from '../features/core/useGridSelector';
import { optionsSelector } from './optionsSelector';

export function useResizeContainer(apiRef): (size: ElementSize) => void {
  const gridLogger = useLogger('useResizeContainer');
  const { autoHeight } = useGridSelector(apiRef, optionsSelector);

  const onResize = React.useCallback(
    (size: ElementSize) => {
      // jsdom has no layout capabilities
      const isJSDOM = /jsdom/.test(window.navigator.userAgent);

      if (size.height === 0 && !autoHeight && !isJSDOM) {
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
      }
      if (size.width === 0 && !isJSDOM) {
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
      }

      gridLogger.info('resized...', size);
      apiRef!.current.resize();
    },
    [gridLogger, apiRef, autoHeight],
  );

  return onResize;
}
