import { useEffect } from 'react';
import { useLogger } from '../utils/useLogger';
import {KEYDOWN_EVENT, KEYUP_EVENT, MULTIPLE_KEY_PRESS_CHANGED} from '../../constants/eventsConstants';

import { GridApiRef } from '../../grid';
import {findGridRootFromCurrent} from "../../utils";

const MULTIPLE_SELECTION_KEYS = ['Meta', 'Control'];
const isMultipleKey = (key: string): boolean => MULTIPLE_SELECTION_KEYS.indexOf(key) > -1;
const isTabKey = (key: string): boolean => key === 'Tab';
const isSpaceKey = (key: string): boolean => key === 'Space';
const isArrowKeys = (key: string): boolean => key.indexOf('Arrow') === 0;

export const useKeyboard = (initialised: boolean, apiRef: GridApiRef): void => {
  const logger = useLogger('useKeyboard');

  const onMultipleKeyChange = (isPressed: boolean) => {
    if (apiRef.current) {
      apiRef.current.emit(MULTIPLE_KEY_PRESS_CHANGED, isPressed);
    }
  };

  const onKeyDownHandler = (e: KeyboardEvent) => {
    console.log('Active elt: ', document.activeElement);

    if(!e.target || !findGridRootFromCurrent(e.target as Element)) {
      logger.info('Outside the grid', e);
      return;
    }

    if (isMultipleKey(e.key)) {
      logger.debug('Multiple Select key pressed');
      onMultipleKeyChange(true);
    } else if(isTabKey(e.code)) {
      logger.debug('tab key pressed!');
      //TODO move to next section previous - headers-rows - next
    } else if(isArrowKeys(e.code)) {
      logger.debug('Arrow pressed!');
      //TODO move to next cell
    } else if(isSpaceKey(e.code)) {
      logger.debug('Space pressed!');
      //TODO select row
    }

    logger.info('Key down, stopping event ', e);
    e.preventDefault();
    e.stopPropagation();
  };

  const onKeyUpHandler = (e: KeyboardEvent) => {
    console.log('Active elt: ', document.activeElement);

    if(!e.target || !findGridRootFromCurrent(e.target as Element)) {
      logger.info('Outside the grid', e);
      return;
    }

    if (isMultipleKey(e.key)) {
      logger.debug('Multiple Select key released');
      onMultipleKeyChange(false);
    }
    // logger.info('Key up, stopping event ', e);
    e.preventDefault();
    e.stopPropagation();
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
