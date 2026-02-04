export const preventDefault = (event: Event) => {
  if (event.cancelable) {
    event.preventDefault();
  }
};
