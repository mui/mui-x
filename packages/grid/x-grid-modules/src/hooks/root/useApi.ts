import * as React from 'react';
import { useLogger } from '../utils/useLogger';
import { COMPONENT_ERROR, UNMOUNT } from '../../constants/eventsConstants';
import { GridOptions, ApiRef } from '../../models';
import { GridApi } from '../../models/api/gridApi';
import { useApiMethod } from './useApiMethod';

const EventEmitter = require('events').EventEmitter;

export function useApi(
  gridRootRef: React.RefObject<HTMLDivElement>,
  options: GridOptions,
  apiRef: ApiRef,
): boolean {
  const [isApiInitialised, setApiInitialised] = React.useState(false);
  const [initialised, setInit] = React.useState(false);
  const logger = useLogger('useApi');

  const initApi = React.useCallback(() => {
    logger.debug('Initialising grid api.');
    const api = new EventEmitter();
    apiRef.current = api as GridApi;
    setApiInitialised(true);
  }, [apiRef, logger, setApiInitialised]);

  React.useEffect(() => {
    if (apiRef) {
      initApi();
    }
  }, [apiRef, initApi]);

  const emitEvent = React.useCallback(
    (name: string, ...args: any[]) => {
      if (apiRef && apiRef.current) {
        apiRef.current.emit(name, ...args);
      }
    },
    [apiRef],
  );

  const registerEvent = React.useCallback(
    (event: string, handler: (param: any) => void): (() => void) => {
      logger.debug(`Binding ${event} event`);
      apiRef.current!.on(event, handler);
      const api = apiRef.current!;
      return () => {
        logger.debug(`Clearing ${event} event`);
        api.removeListener(event, handler);
      };
    },
    [apiRef, logger],
  );

  const showError = React.useCallback(
    (args) => {
      emitEvent(COMPONENT_ERROR, args);
    },
    [emitEvent],
  );

  useApiMethod(apiRef, { registerEvent, emitEvent, showError }, 'CoreApi');
  React.useEffect(() => {
    if (gridRootRef && gridRootRef.current && isApiInitialised) {
      apiRef.current!.isInitialised = true;
      apiRef.current!.rootElementRef = gridRootRef;

      setInit(true);
      const api = apiRef.current!;

      return () => {
        logger.debug('Unmounting Grid component');
        api.emit(UNMOUNT);
        logger.debug('Clearing all events listeners');
        api.removeAllListeners();
      };
    }
    return undefined;
  }, [gridRootRef, isApiInitialised, logger, apiRef]);

  return initialised;
}
