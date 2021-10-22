import * as React from 'react';

import { GridApiRef, Logger } from '../../models';
import { GridComponentProps } from '../../GridComponentProps';
import { GridLoggerApi } from '../../models/api/gridLoggerApi';
import { localStorageAvailable } from '../../utils/utils';

const forceDebug = localStorageAvailable() && window.localStorage.getItem('DEBUG') != null;

const noop = () => {};

const noopLogger: Logger = {
  debug: noop,
  info: noop,
  warn: noop,
  error: noop,
};

const LOG_LEVELS = ['debug', 'info', 'warn', 'error'];

function getAppender(name: string, logLevel: string, appender: Logger = console): Logger {
  const minLogLevelIdx = LOG_LEVELS.indexOf(logLevel);

  if (minLogLevelIdx === -1) {
    throw new Error(`MUI: Log level ${logLevel} not recognized.`);
  }

  const logger = LOG_LEVELS.reduce((loggerObj, method, idx) => {
    if (idx >= minLogLevelIdx) {
      loggerObj[method] = (...args: any[]) => {
        const [message, ...other] = args;

        (appender as any)[method](`MUI: ${name} - ${message}`, ...other);
      };
    } else {
      loggerObj[method] = noop;
    }
    return loggerObj;
  }, {} as any);

  return logger as Logger;
}

export const useGridLoggerFactory = (
  apiRef: GridApiRef,
  props: Pick<GridComponentProps, 'logger' | 'logLevel'>,
) => {
  apiRef.current.getLogger = React.useCallback<GridLoggerApi['getLogger']>(
    (name: string): Logger => {
      if (forceDebug) {
        return getAppender(name, 'debug', props.logger);
      }

      if (!props.logLevel) {
        return noopLogger;
      }

      return getAppender(name, props.logLevel!.toString(), props.logger);
    },
    [props.logLevel, props.logger],
  );
};
