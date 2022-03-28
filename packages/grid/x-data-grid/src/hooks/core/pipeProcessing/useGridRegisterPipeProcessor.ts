import * as React from 'react';
import { useFirstRender } from '../../utils/useFirstRender';
import { GridApiCommon } from '../../../models/api/gridApiCommon';
import { GridPipeProcessorGroup, GridPipeProcessor } from './gridPipeProcessingApi';

/**
 * TODO: Rename `useGridRegisterPipeProcessor`
 */
export const useGridRegisterPipeProcessor = <
  Api extends GridApiCommon,
  G extends GridPipeProcessorGroup,
>(
  apiRef: React.MutableRefObject<Api>,
  group: G,
  callback: GridPipeProcessor<G>,
) => {
  const cleanup = React.useRef<(() => void) | null>();
  const id = React.useRef(`mui-${Math.round(Math.random() * 1e9)}`);

  const registerPreProcessor = React.useCallback(() => {
    cleanup.current = apiRef.current.unstable_registerPipeProcessor(group, id.current, callback);
  }, [apiRef, callback, group]);

  useFirstRender(() => {
    registerPreProcessor();
  });

  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      registerPreProcessor();
    }

    return () => {
      if (cleanup.current) {
        cleanup.current();
        cleanup.current = null;
      }
    };
  }, [registerPreProcessor]);
};
