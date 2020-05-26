import { isFunction } from '../../utils';

const isDebugging = process.env.NODE_ENV !== 'production' || localStorage.getItem('DEBUG') != null;

export interface Logger {
  debug: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};
export const noopLogger: Logger = {
  debug: noop,
  info: noop,
  warn: noop,
  error: noop,
};

const getAppender = (name: string, appender: Logger = console): Logger => {
  const logger = ['debug', 'info', 'warn', 'error'].reduce((logger, method) => {
    logger[method] = (...args: any[]) => {
      const [message, ...rest] = args;
      (appender as any)[method](`[${name}] - ${message}`, ...rest);
    };
    return logger;
  }, {} as any);

  return logger as Logger;
};

const defaultFactory: LoggerFactoryFn = (name: string) => {
  if (!isDebugging) {
    return noopLogger;
  }
  return getAppender(name);
};
let factory: LoggerFactoryFn = defaultFactory;

export function useLogger(name: string): Logger {
  return factory(name);
}

export type LoggerFactoryFn = (name: string) => Logger;

export function useLoggerFactory(customLogger?: Logger | LoggerFactoryFn) {
  if (!customLogger) {
    factory = defaultFactory;
    return;
  }

  if (isFunction(customLogger)) {
    factory = customLogger;
    return;
  }

  factory = (name: string) => getAppender(name, customLogger);
}
