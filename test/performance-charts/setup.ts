import { beforeAll } from 'vitest';
import { generateLicense, LicenseInfo } from '@mui/x-license';

beforeAll(() => {
  if (!window.SVGGraphicsElement.prototype.getBBox) {
    /* JSDOM does not implement getBBox, so we need to polyfill it.
     * Plus, JSDOM does not support `SVGTextElement`, so we need to check for its existence in `SVGGraphicsElement` to
     * verify we're not running in a browser environment, but then we need to apply the polyfill to `SVGElement` instead
     * instead of `SVGGraphicsElement` as JSDOM does not implement the latter.
     * GitHub Issue: https://github.com/jsdom/jsdom/issues/3310 */
    Object.defineProperty(window.SVGElement.prototype, 'getBBox', {
      writable: true,
      value: () => ({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      }),
    });
  }

  const licenseKey = generateLicense({
    expiryDate: new Date(3001, 0, 0, 0, 0, 0, 0),
    orderNumber: 'MUI-123',
    planScope: 'pro',
    licenseModel: 'subscription',
    planVersion: 'Q3-2024',
  });

  LicenseInfo.setLicenseKey(licenseKey);
});
