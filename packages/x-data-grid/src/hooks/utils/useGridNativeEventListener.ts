import { RefObject } from '@mui/x-internals/types';
import { useGridLogger } from './useGridLogger';
import { GridPrivateApiCommon } from '../../models/api/gridApiCommon';
import { useGridEventPriority } from './useGridEvent';

export const useGridNativeEventListener = <
  PrivateApi extends GridPrivateApiCommon,
  K extends keyof HTMLElementEventMap,
>(
  apiRef: RefObject<PrivateApi>,
  ref: () => HTMLElement | undefined | null,
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => any,
  options?: AddEventListenerOptions,
) => {
  const logger = useGridLogger(apiRef, 'useNativeEventListener');

  useGridEventPriority(apiRef, 'rootMount', () => {
    const targetElement = ref();

    if (!targetElement || !eventName) {
      return undefined;
    }

    logger.debug(`Binding native ${eventName} event`);
    targetElement.addEventListener(eventName, handler, options);

    return () => {
      logger.debug(`Clearing native ${eventName} event`);
      targetElement.removeEventListener(eventName, handler, options);
    };
  });
};
