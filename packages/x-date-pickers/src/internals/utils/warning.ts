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
