export const wrapWithDeprecationWarning = <Args extends any[], R extends any>(
  method: (...args: Args) => R,
  message: string,
) => {
  if (process.env.NODE_ENV === 'production') {
    return method;
  }

  let alreadyWarned = false;

  return (...args: Args) => {
    if (!alreadyWarned) {
      alreadyWarned = true;
      console.warn(message);
    }

    return method(...args);
  };
};
