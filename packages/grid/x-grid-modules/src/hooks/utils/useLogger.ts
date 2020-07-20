import * as React from 'react';
import { isFunction } from '../../utils/utils';

const forceDebug = localStorage.getItem('DEBUG') != null;
const isDebugging = process.env.NODE_ENV !== 'production' || forceDebug;

export interface Logger {
  debug: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
}

const noop = () => {};

export const noopLogger: Logger = {
  debug: noop,
  info: noop,
  warn: noop,
  error: noop,
};
const LOG_LEVELS = ['debug', 'info', 'warn', 'error'];
const getAppender = (name: string, logLevel: string, appender: Logger = console): Logger => {
  const minLogLevelIdx = LOG_LEVELS.indexOf(logLevel);

  if (minLogLevelIdx === -1) {
    throw new Error(`Material-UI: Log level ${logLevel} not recognized.`);
  }

  const logger = LOG_LEVELS.reduce((loggerObj, method, idx) => {
    if (idx >= minLogLevelIdx) {
      loggerObj[method] = (...args: any[]) => {
        const [message, ...rest] = args;
        (appender as any)[method](`[${name}] - ${message}`, ...rest);
      };
    } else {
      loggerObj[method] = noop;
    }
    return loggerObj;
  }, {} as any);

  return logger as Logger;
};

const defaultFactory: (logLevel: string) => LoggerFactoryFn = (logLevel: string) => (
  name: string,
) => {
  if (!isDebugging) {
    return noopLogger;
  }
  return getAppender(name, logLevel);
};

export type LoggerFactoryFn = (name: string) => Logger;

// TODO Refactor to allow different logger for each grid in a page...
let factory: LoggerFactoryFn | null;
export function useLoggerFactory(
  customLogger?: Logger | LoggerFactoryFn,
  logLevel: string | boolean = 'info',
) {
  if (forceDebug) {
    factory = defaultFactory('debug');
    return;
  }
  if (!customLogger) {
    factory = logLevel ? defaultFactory(logLevel.toString()) : null;
    return;
  }

  if (isFunction(customLogger)) {
    factory = customLogger;
    return;
  }

  factory = logLevel
    ? (name: string) => getAppender(name, logLevel.toString(), customLogger)
    : null;
}

export function useLogger(name: string): Logger {
  const logger = React.useRef(factory ? factory(name) : noopLogger);
  return logger.current;
}
