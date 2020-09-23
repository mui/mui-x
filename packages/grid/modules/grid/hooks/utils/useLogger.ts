import * as React from 'react';
import { isFunction } from '../../utils/utils';

function localStorageAvailable() {
  try {
    // Incognito mode might reject access to the localStorage for security reasons.
    // window isn't defined on Node.js
    // https://stackoverflow.com/questions/16427636/check-if-localstorage-is-available
    const key = '__some_random_key_you_are_not_going_to_use__';
    window.localStorage.setItem(key, key);
    window.localStorage.removeItem(key);
    return true;
  } catch (err) {
    return false;
  }
}

const forceDebug = localStorageAvailable() && window.localStorage.getItem('DEBUG') != null;

export interface Logger {
  debug: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
}

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
        const [message, ...rest] = args;
        (appender as any)[method](`[${name}] - ${message}`, ...rest);
      };
    } else {
      loggerObj[method] = noop;
    }
    return loggerObj;
  }, {} as any);

  return logger as Logger;
}

const defaultFactory: (logLevel: string) => LoggerFactoryFn = (logLevel: string) => (
  name: string,
) => getAppender(name, logLevel);

type LoggerFactoryFn = (name: string) => Logger;

// TODO Refactor to allow different logger for each grid in a page...
let factory: LoggerFactoryFn | null;

export function useLoggerFactory(
  customLogger?: Logger | LoggerFactoryFn,
  logLevel: string | boolean = 'debug',
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
  const { current: logger } = React.useRef(factory ? factory(name) : noopLogger);
  return logger;
}
