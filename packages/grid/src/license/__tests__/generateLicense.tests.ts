import { generateLicence } from '../generateLicense';
import { LicenseStatus, verifyLicense } from '../verifyLicense';

describe('License: generateLicense', () => {
  it('should generate License properly', () => {
    expect(
      generateLicence({ expiryDate: new Date(1591723879062), version: '1.2.3', developerCount: 10, name: 'Material-UI SAS' }),
    ).toBe(
      '43381d14c87948ff1f07c9a1f4879d96TkFNRTpNYXRlcmlhbC1VSSBTQVMsREVWRUxPUEVSX0NPVU5UPTEwLEVYUElSWT0xNTkxNzIzODc5MDYyLFZFUlNJT049MS4yLjM=',
    );
  });
});

describe('License: verifyLicense ', () => {
  const oneDayInMS = 1000 * 60 * 60 * 24;
  const oneYear = oneDayInMS * 365;

  it('should verify License properly', () => {
    const validLicense = generateLicence({ expiryDate: new Date(new Date().getTime() + oneYear), version: '1.2.3', developerCount: 10, name: 'Material-UI SAS' });
    expect(
      verifyLicense(validLicense),
    ).toBe(LicenseStatus.Valid);
  });

  it('should check expired License properly', () => {
    const expiredLicense = generateLicence({
      expiryDate: new Date(new Date().getTime() - oneDayInMS),
      version: '1.2.3',
      developerCount: 10,
      name: 'Material-UI SAS',
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
