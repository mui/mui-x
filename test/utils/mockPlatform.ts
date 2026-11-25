/**
 * Makes `navigator` report the platform, for the code that names the keys of the OS.
 * Returns a cleanup, so it can be returned from `beforeEach()`.
 * @param {string} platform The value of `navigator.platform`, for example `'MacIntel'` or `'Win32'`.
 * @returns {() => void} Restores the platform of the environment.
 */
export function mockPlatform(platform: string): () => void {
  // Own properties hide the getters of `Navigator.prototype`
  Object.defineProperty(navigator, 'platform', { value: platform, configurable: true });
  // Chromium reads `userAgentData` before `platform`
  Object.defineProperty(navigator, 'userAgentData', { value: undefined, configurable: true });
  return () => {
    Reflect.deleteProperty(navigator, 'platform');
    Reflect.deleteProperty(navigator, 'userAgentData');
  };
}
