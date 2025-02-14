import { beforeAll } from 'vitest';
import { generateLicense, LicenseInfo } from '@mui/x-license';

beforeAll(() => {
  if (!window.SVGGraphicsElement.prototype.getBBox) {
    /* JSDOM does not implement getBBox, so we need to polyfill it. */
    Object.defineProperty(window.SVGGraphicsElement.prototype, 'getBBox', {
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
