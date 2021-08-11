import * as React from 'react';
import { Logger } from '../../models/logger';
import { localStorageAvailable } from '../../utils/utils';
import { GridComponentProps } from '../../GridComponentProps';

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

const defaultFactory: (logLevel: string) => LoggerFactoryFn =
  (logLevel: string) => (name: string) =>
    getAppender(name, logLevel);

type LoggerFactoryFn = (name: string) => Logger;

// TODO Refactor to allow different logger for each grid in a page...
let factory: LoggerFactoryFn | null;

export function useLoggerFactory(
  apiRef: any,
  props: Pick<GridComponentProps, 'logger' | 'logLevel'>,
) {
  if (forceDebug) {
    factory = defaultFactory('debug');
    return;
  }

  if (!props.logger) {
    factory = props.logLevel ? defaultFactory(props.logLevel.toString()) : null;
    return;
  }

  factory = props.logLevel
    ? (name: string) => getAppender(name, props.logLevel!.toString(), props.logger)
    : null;
}

export function useLogger(name: string): Logger {
  const { current: logger } = React.useRef(factory ? factory(name) : noopLogger);
  return logger;
}
