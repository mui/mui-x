import * as React from 'react';
import { useFirstRender } from '../../utils/useFirstRender';
import { GridApiCommon } from '../../../models/api/gridApiCommon';
import { GridStrategyProcessingGroup, GridStrategyProcessor } from './gridStrategyProcessingApi';

export const useGridRegisterStrategyProcessor = <
  Api extends GridApiCommon,
  G extends GridStrategyProcessingGroup,
>(
  apiRef: React.MutableRefObject<Api>,
  group: G,
  strategyName: string,
  processor: GridStrategyProcessor<G>,
) => {
  const registerPreProcessor = React.useCallback(() => {
    apiRef.current.unstable_registerStrategyProcessor(group, strategyName, processor);
  }, [apiRef, processor, group, strategyName]);

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
  }, [registerPreProcessor]);
};
