const warnedOnceCache = new Set();

/**
 * Logs a message to the console on development mode. The warning will only be logged once.
 *
 * The message is the log's cache key. Two identical messages will only be logged once.
 *
 * This function is a no-op in production.
 *
 * @param message the message to log
 * @param gravity the gravity of the warning. Defaults to `'warning'`.
 * @returns
 */
export function warnOnce(message: string | string[], gravity: 'warning' | 'error' = 'warning') {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  const cleanMessage = Array.isArray(message) ? message.join('\n') : message;

  if (!warnedOnceCache.has(cleanMessage)) {
    warnedOnceCache.add(cleanMessage);

    if (gravity === 'error') {
      console.error(cleanMessage);
    } else {
      console.warn(cleanMessage);
    }
  }
}

export function clearWarningsCache() {
  warnedOnceCache.clear();
}
