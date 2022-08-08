import * as React from 'react';
import { isFunction } from '../../utils/utils';
import { useGridLogger } from './useGridLogger';
import { GridApiCommon } from '../../models';

export const useGridNativeEventListener = <
  Api extends GridApiCommon,
  K extends keyof HTMLElementEventMap,
>(
  apiRef: React.MutableRefObject<Api>,
  ref: React.MutableRefObject<HTMLDivElement | null> | (() => HTMLElement | undefined | null),
  eventName: K,
  handler?: (event: HTMLElementEventMap[K]) => any,
  options?: AddEventListenerOptions,
) => {
  const logger = useGridLogger(apiRef, 'useNativeEventListener');
  const [added, setAdded] = React.useState(false);
  const handlerRef = React.useRef(handler);

  const wrapHandler = React.useCallback((event: HTMLElementEventMap[K]) => {
    return handlerRef.current && handlerRef.current(event);
  }, []);

  React.useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  React.useEffect(() => {
    let targetElement: HTMLElement | null | undefined;

    if (isFunction(ref)) {
      targetElement = ref();
    } else {
      targetElement = ref && ref.current ? ref.current : null;
    }

    if (targetElement && eventName && !added) {
      logger.debug(`Binding native ${eventName} event`);
      targetElement.addEventListener(eventName, wrapHandler, options);
      const boundElem = targetElement;
      setAdded(true);

      const unsubscribe = () => {
        logger.debug(`Clearing native ${eventName} event`);
        boundElem.removeEventListener(eventName, wrapHandler, options);
      };

      apiRef.current.subscribeEvent('unmount', unsubscribe);
    }
  }, [ref, wrapHandler, eventName, added, logger, options, apiRef]);
};
