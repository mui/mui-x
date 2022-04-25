import { expect } from 'chai';
import { generateLicense } from '../generateLicense/generateLicense';
import { generateReleaseInfo, verifyLicense } from './verifyLicense';
import { LicenseStatus } from '../utils/licenseStatus';

const oneDayInMS = 1000 * 60 * 60 * 24;
const oneYear = oneDayInMS * 365;
const RELEASE_INFO = generateReleaseInfo();

describe('License: verifyLicense', () => {
  describe('key version: 1', () => {
    const license =
      '0f94d8b65161817ca5d7f7af8ac2f042T1JERVI6TVVJLVN0b3J5Ym9vayxFWFBJUlk9MTY1NDg1ODc1MzU1MCxLRVlWRVJTSU9OPTE=';

    it('should log an error when ReleaseInfo is not valid', () => {
      expect(() => verifyLicense('__RELEASE_INFO__', license, ['pro', 'premium'])).to.throw(
        'MUI: The release information is invalid. Not able to validate license.',
      );
    });

    it('should verify License properly', () => {
      expect(verifyLicense(RELEASE_INFO, license, ['pro', 'premium'])).to.equal(
        LicenseStatus.Valid,
      );
    });

    it('should check expired License properly', () => {
      const expiredLicense = generateLicense({
        expiryDate: new Date(new Date().getTime() - oneDayInMS),
        orderNumber: 'MUI-123',
      });

      expect(verifyLicense(RELEASE_INFO, expiredLicense, ['pro', 'premium'])).to.equal(
        LicenseStatus.Expired,
      );
    });

    it('should return Invalid for invalid license', () => {
      expect(
        verifyLicense(
          RELEASE_INFO,
          'b43ff5f9ac93f021855ff59ff0ba5220TkFNRTpNYC1VSSBTQVMsREVWRUxPUEVSX0NPVU5UPTEwLEVYUElSWT0xNTkxNzIzMDY3MDQyLFZFUlNJT049MS4yLjM',
          ['pro', 'premium'],
        ),
      ).to.equal(LicenseStatus.Invalid);
    });
  });

  describe('key version: 2', () => {
    const licensePro = generateLicense({
      expiryDate: new Date(new Date().getTime() + oneYear),
      orderNumber: 'MUI-123',
      scope: 'pro',
    });

    const licensePremium = generateLicense({
      expiryDate: new Date(new Date().getTime() + oneYear),
      orderNumber: 'MUI-123',
      scope: 'premium',
    });

    it('should log an error when ReleaseInfo is not valid', () => {
      expect(() => verifyLicense('__RELEASE_INFO__', licensePro, ['pro', 'premium'])).to.throw(
        'MUI: The release information is invalid. Not able to validate license.',
      );
    });

    it('should accept pro license for pro features', () => {
      expect(verifyLicense(RELEASE_INFO, licensePro, ['pro', 'premium'])).to.equal(
        LicenseStatus.Valid,
      );
    });

    it('should accept premium license for premium features', () => {
      expect(verifyLicense(RELEASE_INFO, licensePremium, ['premium'])).to.equal(
        LicenseStatus.Valid,
      );
    });

    it('should not accept pro license for premium feature', () => {
      expect(verifyLicense(RELEASE_INFO, licensePro, ['premium'])).to.equal(LicenseStatus.Invalid);
    });

    it('should check expired License properly', () => {
      const expiredLicense = generateLicense({
        expiryDate: new Date(new Date().getTime() - oneDayInMS),
        orderNumber: 'MUI-123',
      });

      expect(verifyLicense(RELEASE_INFO, expiredLicense, ['pro', 'premium'])).to.equal(
        LicenseStatus.Expired,
      );
    });

    it('should return Invalid for invalid license', () => {
      expect(
        verifyLicense(
          RELEASE_INFO,
          'b43ff5f9ac93f021855ff59ff0ba5220TkFNRTpNYC1VSSBTQVMsREVWRUxPUEVSX0NPVU5UPTEwLEVYUElSWT0xNTkxNzIzMDY3MDQyLFZFUlNJT049MS4yLjM',
          ['pro', 'premium'],
        ),
      ).to.equal(LicenseStatus.Invalid);
    });
  });
});
