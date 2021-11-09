import { expect } from 'chai';
import { generateLicence } from './generateLicense';
import { generateReleaseInfo, verifyLicense } from './verifyLicense';
import { LicenseStatus } from './licenseStatus';

const oneDayInMS = 1000 * 60 * 60 * 24;
const oneYear = oneDayInMS * 365;
const RELEASE_INFO = generateReleaseInfo();

describe('License: verifyLicense', () => {
  const validLicense = generateLicence({
    expiryDate: new Date(new Date().getTime() + oneYear),
    orderNumber: 'MUI-123',
  });

  it('should log an error when ReleaseInfo is not valid', () => {
    expect(() => verifyLicense('__RELEASE_INFO__', validLicense)).to.throw(
      'MUI: The release information is invalid. Not able to validate license.',
    );
  });

  it('should verify License properly', () => {
    expect(verifyLicense(RELEASE_INFO, validLicense)).to.equal(LicenseStatus.Valid);
  });

  it('should check expired License properly', () => {
    const expiredLicense = generateLicence({
      expiryDate: new Date(new Date().getTime() - oneDayInMS),
      orderNumber: 'MUI-123',
    });

    expect(verifyLicense(RELEASE_INFO, expiredLicense)).to.equal(LicenseStatus.Expired);
  });

  it('should return Invalid for invalid license', () => {
    expect(
      verifyLicense(
        RELEASE_INFO,
        'b43ff5f9ac93f021855ff59ff0ba5220TkFNRTpNYC1VSSBTQVMsREVWRUxPUEVSX0NPVU5UPTEwLEVYUElSWT0xNTkxNzIzMDY3MDQyLFZFUlNJT049MS4yLjM',
      ),
    ).to.equal(LicenseStatus.Invalid);
  });
});
