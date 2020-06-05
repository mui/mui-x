import { useEffect, useState } from 'react';
import { useLogger } from '../utils';
import { GridApiRef } from '../../grid';
import { isFunction } from '../../utils';

export const useNativeEventListener = (
  apiRef: GridApiRef,
  ref: React.MutableRefObject<HTMLDivElement | null> | (() => Element | undefined | null),
  eventName: string,
  handler?: (event: Event) => any,
  options?: AddEventListenerOptions,
) => {
  const logger = useLogger('useNativeEventListener');
  const [added, setAdded] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let targetElement: Element | null | undefined;

    if (isFunction(ref)) {
      targetElement = ref();
    } else {
      targetElement = ref && ref.current ? ref.current : null;
    }

    if (targetElement && handler && eventName && !added) {
      logger.debug(`Binding native ${eventName} event`);
      targetElement.addEventListener(eventName, handler, options);
      const bindedElem = targetElement;
      setAdded(true);

      const unsubscribe = () => {
        logger.debug(`Clearing native ${eventName} event`);
        bindedElem.removeEventListener(eventName, handler, options);
      };

      apiRef.current!.onUnmount(unsubscribe);
    }
  });
};
