const isDebugging = process.env.NODE_ENV !== 'production';

interface Logger {
  debug: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};
const noopLogger: Logger = {
  debug: noop,
  info: noop,
  warn: noop,
  error: noop,
};

const getConsoleAppender = (name: string): Logger => {
  const logger = ['debug', 'info', 'warn', 'error'].reduce((logger, method) => {
    logger[method] = (...args: any[]) => {
      const [message, ...rest] = args;
      console[method](`[${name}] - ${message}`, ...rest);
    };
    return logger;
  }, {});

  return logger as Logger;
};

export function useLogger(name: string): Logger {
  if (!isDebugging) {
    return noopLogger;
  }
  return getConsoleAppender(name);
}
