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
