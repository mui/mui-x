import { createLogOnce, reset } from '@base-ui/utils/warn';

const logWarning = createLogOnce('warn');
const logError = createLogOnce('error');

/**
 * Logs a message to the console in development mode, once per unique message.
 * This function is a no-op in production.
 */
export function warnOnce(message: string | string[], gravity: 'warning' | 'error' = 'warning') {
  const cleanMessage = Array.isArray(message) ? message.join('\n') : message;

  if (gravity === 'error') {
    logError(cleanMessage);
  } else {
    logWarning(cleanMessage);
  }
}

export { reset as clearWarningsCache };
