export const buildDeprecatedPropsWarning = (message: string | string[]) => {
  let alreadyWarned = false;

  if (process.env.NODE_ENV === 'production') {
    return () => {};
  }

  const cleanMessage = Array.isArray(message) ? message.join('\n') : message;

  return (deprecatedProps: { [key: string]: any }) => {
    const deprecatedKeys = Object.entries(deprecatedProps)
      .filter(([, value]) => value !== undefined)
      .map(([key]) => `- ${key}`);

    if (!alreadyWarned && deprecatedKeys.length > 0) {
      alreadyWarned = true;

      console.warn([cleanMessage, 'deprecated props observed:', ...deprecatedKeys].join('\n'));
    }
  };
};

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
