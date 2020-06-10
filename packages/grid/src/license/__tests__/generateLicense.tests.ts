import { generateLicence } from '../generateLicense';
import { LicenseStatus, verifyLicense } from '../verifyLicense';

const oneDayInMS = 1000 * 60 * 60 * 24;
const oneYear = oneDayInMS * 365;

describe('License: generateLicense', () => {
  it('should generate License properly', () => {
    expect(
      generateLicence({ expiryDate: new Date(1591723879062), orderNumber: 'MUI-123' }),
    ).toBe(
      'e34253b37166e7a4a85189b91b653e63T1JERVI6TVVJLTEyMyxFWFBJUlk9MTU5MTcyMzg3OTA2MixLRVlWRVJTSU9OPTE=',
    );
  });
});

describe('License: verifyLicense ', () => {
  it('should verify License properly', () => {
    const validLicense = generateLicence({ expiryDate: new Date(new Date().getTime() + oneYear), orderNumber: 'MUI-123' });
    expect(
      verifyLicense(validLicense),
    ).toBe(LicenseStatus.Valid);
  });

  it('should check expired License properly', () => {
    const expiredLicense = generateLicence({
      expiryDate: new Date(new Date().getTime() - oneDayInMS),
      orderNumber: 'MUI-123'
    });

    expect(verifyLicense(expiredLicense)).toBe(LicenseStatus.Expired);
  });

  it('should return Invalid for invalid license', () => {
    expect(
      verifyLicense(
        'b43ff5f9ac93f021855ff59ff0ba5220TkFNRTpNYC1VSSBTQVMsREVWRUxPUEVSX0NPVU5UPTEwLEVYUElSWT0xNTkxNzIzMDY3MDQyLFZFUlNJT049MS4yLjM',
      ),
    ).toBe(LicenseStatus.Invalid);
  });
});
