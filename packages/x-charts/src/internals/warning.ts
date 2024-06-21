export function buildWarning(
  message: (...args: any) => string,
  gravity: 'warning' | 'error' = 'warning',
) {
  let alreadyWarned = false;

  return (...args: any) => {
    if (!alreadyWarned) {
      alreadyWarned = true;
      if (gravity === 'error') {
        console.error(message(...args));
      } else {
        console.warn(message(...args));
      }
    }
  };
}
