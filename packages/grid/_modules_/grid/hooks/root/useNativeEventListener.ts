import * as React from 'react';
import { GridApiRef } from '../../models/api/gridApiRef';
import { isFunction } from '../../utils/utils';
import { useLogger } from '../utils/useLogger';

export const useNativeEventListener = (
  apiRef: GridApiRef,
  ref: React.MutableRefObject<HTMLDivElement | null> | (() => Element | undefined | null),
  eventName: string,
  handler?: (event: Event) => any,
  options?: AddEventListenerOptions,
) => {
  const logger = useLogger('useNativeEventListener');
  const [added, setAdded] = React.useState(false);
  const handlerRef = React.useRef(handler);

  const wrapHandler = React.useCallback((args) => {
    return handlerRef.current && handlerRef.current(args);
  }, []);

  React.useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  React.useEffect(() => {
    let targetElement: Element | null | undefined;

    if (isFunction(ref)) {
      targetElement = ref();
    } else {
      targetElement = ref && ref.current ? ref.current : null;
    }

    if (targetElement && wrapHandler && eventName && !added) {
      logger.debug(`Binding native ${eventName} event`);
      targetElement.addEventListener(eventName, wrapHandler, options);
      const bindedElem = targetElement;
      setAdded(true);

      const unsubscribe = () => {
        logger.debug(`Clearing native ${eventName} event`);
        bindedElem.removeEventListener(eventName, wrapHandler, options);
      };

      apiRef.current.onUnmount(unsubscribe);
    }
  }, [ref, wrapHandler, eventName, added, logger, options, apiRef]);
};
