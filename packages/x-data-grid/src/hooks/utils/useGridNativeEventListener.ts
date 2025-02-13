import { RefObject } from '@mui/x-internals/types';
import { useGridLogger } from './useGridLogger';
import { GridPrivateApiCommon } from '../../models/api/gridApiCommon';
import { useGridApiOptionHandler } from './useGridApiEventHandler';

export const useGridNativeEventListener = <
  PrivateApi extends GridPrivateApiCommon,
  K extends keyof HTMLElementEventMap,
>(
  apiRef: RefObject<PrivateApi>,
  ref: React.RefObject<HTMLDivElement | null> | (() => HTMLElement | undefined | null),
  eventName: K,
  handler?: (event: HTMLElementEventMap[K]) => any,
  options?: AddEventListenerOptions,
) => {
  const logger = useGridLogger(apiRef, 'useNativeEventListener');

  useGridApiOptionHandler(apiRef, 'rootMount', () => {
    const targetElement = typeof ref === 'function' ? ref() : ref.current;

    if (!targetElement || !eventName || !handler) {
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
