export const doNothing = () => {};

// Corresponds to 10 frames at 60 Hz.
export const throttle = (func: Function, wait = 166) => {
  let lastCall = 0;
  return (...args: any[]) => {
    const now = Date.now();
    if (now >= lastCall + wait) {
      lastCall = now;
      func(...args);
    }
  };
};
