import { useEffect } from 'react';

import { useLogger } from '../utils/useLogger';
import { KEYDOWN_EVENT, KEYUP_EVENT, MULTIPLE_KEY_PRESS_CHANGED } from '../../constants/eventsConstants';

import { GridApiRef } from '../../grid';

const MULTIPLE_SELECTION_KEYS = ['Meta', 'Control'];
const isMultipleKey = (key: string): boolean => MULTIPLE_SELECTION_KEYS.indexOf(key) > -1;

export const useKeyboard = (initialised: boolean, apiRef: GridApiRef): void => {
  const logger = useLogger('useKeyboard');

  const onMultipleKeyChange = (isPressed: boolean) => {
    if (apiRef.current) {
      apiRef.current.emit(MULTIPLE_KEY_PRESS_CHANGED, isPressed);
    }
  };

  const onKeyDownHandler = e => {
    if (isMultipleKey(e.key)) {
      logger.debug('Multiple Select key pressed');
      onMultipleKeyChange(true);
    }
  };
  const onKeyUpHandler = e => {
    if (isMultipleKey(e.key)) {
      logger.debug('Multiple Select key released');
      onMultipleKeyChange(false);
    }
  };

  useEffect(() => {
    if (apiRef && apiRef.current && initialised) {
      logger.debug('Binding keyboard events');
      apiRef.current.on(KEYDOWN_EVENT, onKeyDownHandler);
      apiRef.current.on(KEYUP_EVENT, onKeyUpHandler);

      return () => {
        apiRef.current!.removeListener(KEYDOWN_EVENT, onKeyDownHandler);
        apiRef.current!.removeListener(KEYUP_EVENT, onKeyUpHandler);
        apiRef.current!.removeAllListeners(MULTIPLE_KEY_PRESS_CHANGED);
      };
    }
  }, [initialised]);
};
