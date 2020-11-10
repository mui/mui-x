import * as React from 'react';
import { ElementSize } from '../../models';
import { useLogger } from './useLogger';

export function useResizeContainer(apiRef): (size: ElementSize) => void {
  const gridLogger = useLogger('useResizeContainer');
  const widthTimeout = React.useRef<any>();
  const heightTimeout = React.useRef<any>();

  const onResize = React.useCallback(
    (size: ElementSize) => {
      clearTimeout(widthTimeout.current);
      clearTimeout(heightTimeout.current);

      if (size.height === 0) {
        // Use timeout to allow simpler tests in JSDOM.
        widthTimeout.current = setTimeout(() => {
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
        });
      }
      if (size.width === 0) {
        // Use timeout to allow simpler tests in JSDOM.
        heightTimeout.current = setTimeout(() => {
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
        });
      }

      gridLogger.info('resized...', size);
      if (apiRef!.current.resize) {
        apiRef!.current.resize();
      }
    },
    [gridLogger, apiRef],
  );

  React.useEffect(() => {
    return () => {
      clearTimeout(widthTimeout.current);
      clearTimeout(heightTimeout.current);
    };
  }, []);

  return onResize;
}
