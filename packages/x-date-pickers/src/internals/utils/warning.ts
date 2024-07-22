const warnedOnceCache = new Set();

// TODO move to @mui/x-internals
// TODO eventually move to @base_ui/internals. Base UI, etc. too need this helper.
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
