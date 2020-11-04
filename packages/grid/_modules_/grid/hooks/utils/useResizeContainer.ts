import debounce from '@material-ui/core/utils/debounce';
import * as React from 'react';
import { ElementSize } from '../../models';
import { useLogger } from './useLogger';

export function useResizeContainer(apiRef): (size: ElementSize) => void {
  const gridLogger = useLogger('useResizeContainer');

  const onResize = React.useCallback(
    (size: ElementSize) => {
      if (size.height === 0) {
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
      if (size.width === 0) {
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
    [gridLogger, apiRef],
  );
  const debouncedOnResize = React.useMemo(() => debounce(onResize, 50), [onResize]);

  React.useEffect(() => {
    return () => {
      gridLogger.info('canceling resize...');
      debouncedOnResize.clear();
    };
  }, [gridLogger, debouncedOnResize]);

  return debouncedOnResize;
}
