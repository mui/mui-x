import * as React from 'react';
import { useFirstRender } from '../../utils/useFirstRender';
import { GridApiCommon } from '../../../models/api/gridApiCommon';
import { GridStrategyProcessorName, GridStrategyProcessor } from './gridStrategyProcessingApi';

export const useGridRegisterStrategyProcessor = <
  Api extends GridApiCommon,
  G extends GridStrategyProcessorName,
>(
  apiRef: React.MutableRefObject<Api>,
  strategyName: string,
  group: G,
  processor: GridStrategyProcessor<G>,
) => {
  const registerPreProcessor = React.useCallback(() => {
    apiRef.current.unstable_registerStrategyProcessor(strategyName, group, processor);
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
