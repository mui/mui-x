import { generateLicence } from '../generateLicense';
import { generateReleaseInfo, verifyLicense } from '../verifyLicense';
import {LicenseStatus} from "../licenseStatus";

const oneDayInMS = 1000 * 60 * 60 * 24;
const oneYear = oneDayInMS * 365;
const originalWindow = { ...window };

const mockLocation = (fakeLocation: any) => {
  const location = {
    ...originalWindow.location,
    ...fakeLocation,
  };
  Object.defineProperty(window, 'location', {
    configurable: true,
    enumerable: true,
    value: location,
    writable: true,
  });
};
const RELEASE_INFO = generateReleaseInfo();
describe('License: verifyLicense ', () => {
  const validLicense = generateLicence({
    expiryDate: new Date(new Date().getTime() + oneYear),
    orderNumber: 'MUI-123',
  });

  beforeEach(() => {
    mockLocation({ href: 'https://any-web.app/' });
  });

  afterEach(() => {
    mockLocation(null);
  });

  it('should log an error when ReleaseInfo is not valid', () => {
    expect(() => verifyLicense('__RELEASE_INFO__', validLicense)).toThrow(
      'Package ReleaseInfo is invalid. Cannot check license key!',
    );
  });

  it('should validate license for material-ui storybook', () => {
    mockLocation({ href: 'https://muix-storybook.netlify.app/' });
    expect(verifyLicense(RELEASE_INFO, 'no license needed')).toBe(LicenseStatus.Valid);
  });

  it('should validate license for material-ui demo doc', () => {
    mockLocation({ href: 'https://material-ui.com/page/grid/demo' });
    expect(verifyLicense(RELEASE_INFO, 'no license needed')).toBe(LicenseStatus.Valid);
  });

  it('should verify License properly', () => {
    expect(verifyLicense(RELEASE_INFO, validLicense)).toBe(LicenseStatus.Valid);
  });

  it('should check expired License properly', () => {
    const expiredLicense = generateLicence({
      expiryDate: new Date(new Date().getTime() - oneDayInMS),
      orderNumber: 'MUI-123',
    });

    expect(verifyLicense(RELEASE_INFO, expiredLicense)).toBe(LicenseStatus.Expired);
  });

  it('should return Invalid for invalid license', () => {
    expect(
      verifyLicense(
        RELEASE_INFO,
        'b43ff5f9ac93f021855ff59ff0ba5220TkFNRTpNYC1VSSBTQVMsREVWRUxPUEVSX0NPVU5UPTEwLEVYUElSWT0xNTkxNzIzMDY3MDQyLFZFUlNJT049MS4yLjM',
      ),
    ).toBe(LicenseStatus.Invalid);
  });
});
