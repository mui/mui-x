import * as React from 'react';
import { GridEvents } from '../../models/events';
import { GridApiRef } from '../../models/api/gridApiRef';
import { isFunction } from '../../utils/utils';
import { useGridLogger } from './useGridLogger';

export const useGridNativeEventListener = <E extends Event>(
  apiRef: GridApiRef,
  ref: React.MutableRefObject<HTMLDivElement | null> | (() => Element | undefined | null),
  eventName: string,
  handler?: (event: E) => any,
  options?: AddEventListenerOptions,
) => {
  const logger = useGridLogger(apiRef, 'useNativeEventListener');
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
      const boundElem = targetElement;
      setAdded(true);

      const unsubscribe = () => {
        logger.debug(`Clearing native ${eventName} event`);
        boundElem.removeEventListener(eventName, wrapHandler, options);
      };

      apiRef.current.subscribeEvent(GridEvents.unmount, unsubscribe);
    }
  }, [ref, wrapHandler, eventName, added, logger, options, apiRef]);
};
