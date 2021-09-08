import * as React from 'react';
import { Logger } from '../../models/logger';
import { localStorageAvailable } from '../../utils/utils';
import { GridComponentProps } from '../../GridComponentProps';
import { GridApiRef } from '../../models/api/gridApiRef';
import { GridLoggerApi } from '../../models/api/gridLoggerApi';

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
    throw new Error(`Material-UI: Log level ${logLevel} not recognized.`);
  }

  const logger = LOG_LEVELS.reduce((loggerObj, method, idx) => {
    if (idx >= minLogLevelIdx) {
      loggerObj[method] = (...args: any[]) => {
        const [message, ...other] = args;

        (appender as any)[method](`Material-UI: ${name} - ${message}`, ...other);
      };
    } else {
      loggerObj[method] = noop;
    }
    return loggerObj;
  }, {} as any);

  return logger as Logger;
}

export function useGridLoggerFactory(
  apiRef: GridApiRef,
  props: Pick<GridComponentProps, 'logger' | 'logLevel'>,
) {
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
}

export function useGridLogger(apiRef: GridApiRef, name: string): Logger {
  const logger = React.useRef<Logger | null>(null);

  if (logger.current) {
    return logger.current;
  }

  const newLogger = apiRef.current.getLogger(name);
  logger.current = newLogger;

  return newLogger;
}
