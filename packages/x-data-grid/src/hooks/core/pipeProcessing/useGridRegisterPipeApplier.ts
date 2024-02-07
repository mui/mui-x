import * as React from 'react';
import { useFirstRender } from '../../utils/useFirstRender';
import { GridPrivateApiCommon } from '../../../models/api/gridApiCommon';
import { GridPipeProcessorGroup } from './gridPipeProcessingApi';

export const useGridRegisterPipeApplier = <
  PrivateApi extends GridPrivateApiCommon,
  G extends GridPipeProcessorGroup,
>(
  apiRef: React.MutableRefObject<PrivateApi>,
  group: G,
  callback: () => void,
) => {
  const cleanup = React.useRef<(() => void) | null>();
  const id = React.useRef(`mui-${Math.round(Math.random() * 1e9)}`);

  const registerPreProcessor = React.useCallback(() => {
    cleanup.current = apiRef.current.registerPipeApplier(group, id.current, callback);
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
