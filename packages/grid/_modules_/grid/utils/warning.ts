export const buildWarning = (message: string | string[]) => {
  let alreadyWarned = false;

  const cleanMessage = Array.isArray(message) ? message.join('\n') : message;

  return () => {
    if (!alreadyWarned) {
      alreadyWarned = true;
      console.warn(cleanMessage);
    }
  };
};

export const wrapWithWarningOnCall = <Args extends any[], R extends any>(
  method: (...args: Args) => R,
  message: string | string[],
) => {
  if (process.env.NODE_ENV === 'production') {
    return method;
  }

  return (...args: Args) => {
    buildWarning(message);
    return method(...args);
  };
};
