// Based on https://stackoverflow.com/a/59518678
let cachedSupportsPreventScroll: boolean;
export function doesSupportPreventScroll(): boolean {
  if (cachedSupportsPreventScroll === undefined) {
    document.createElement('div').focus({
      get preventScroll() {
        cachedSupportsPreventScroll = true;
        return false;
      },
    });
  }
  return cachedSupportsPreventScroll;
}
