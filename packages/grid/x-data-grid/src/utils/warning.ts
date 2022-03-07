export const buildWarning = (
  message: string | string[],
  gravity: 'warning' | 'error' = 'warning',
) => {
  let alreadyWarned = false;

  const cleanMessage = Array.isArray(message) ? message.join('\n') : message;

  return () => {
    if (!alreadyWarned) {
      alreadyWarned = true;
      if (gravity === 'error') {
        console.error(cleanMessage);
      } else {
        console.warn(cleanMessage);
      }
    }
  };
};

export const wrapWithWarningOnCall = <F extends Function>(
  method: F,
  message: string | string[],
) => {
  if (process.env.NODE_ENV === 'production') {
    return method;
  }

  const warning = buildWarning(message);

  return (...args: any[]) => {
    warning();
    return method(...args);
  };
};
