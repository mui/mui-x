import { expect } from 'chai';
import { generateLicense } from '../generateLicense/generateLicense';
import { generateReleaseInfo, verifyLicense } from './verifyLicense';
import { LicenseStatus } from '../utils/licenseStatus';

const oneDayInMS = 1000 * 60 * 60 * 24;
const releaseDate = new Date(2018, 0, 0, 0, 0, 0, 0);
const RELEASE_INFO = generateReleaseInfo(releaseDate);

describe('License: verifyLicense', () => {
  describe('key version: 1', () => {
    const licenseKey =
      '0f94d8b65161817ca5d7f7af8ac2f042T1JERVI6TVVJLVN0b3J5Ym9vayxFWFBJUlk9MTY1NDg1ODc1MzU1MCxLRVlWRVJTSU9OPTE=';

    it('should log an error when ReleaseInfo is not valid', () => {
      expect(() =>
        verifyLicense({
          releaseInfo: '__RELEASE_INFO__',
          licenseKey,
          acceptedScopes: ['pro', 'premium'],
          isProduction: true,
        }),
      ).to.throw('MUI: The release information is invalid. Not able to validate license.');
    });

    it('should verify License properly', () => {
      expect(
        verifyLicense({
          releaseInfo: RELEASE_INFO,
          licenseKey,
          acceptedScopes: ['pro', 'premium'],
          isProduction: true,
        }),
      ).to.equal(LicenseStatus.Valid);
    });

    it('should check expired License properly', () => {
      const expiredLicenseKey = generateLicense({
        expiryDate: new Date(releaseDate.getTime() - oneDayInMS),
        orderNumber: 'MUI-123',
      });

      expect(
        verifyLicense({
          releaseInfo: RELEASE_INFO,
          licenseKey: expiredLicenseKey,
          acceptedScopes: ['pro', 'premium'],
          isProduction: true,
        }),
      ).to.equal(LicenseStatus.Expired);
    });

    it('should return Invalid for invalid license', () => {
      expect(
        verifyLicense({
          releaseInfo: RELEASE_INFO,
          licenseKey:
            'b43ff5f9ac93f021855ff59ff0ba5220TkFNRTpNYC1VSSBTQVMsREVWRUxPUEVSX0NPVU5UPTEwLEVYUElSWT0xNTkxNzIzMDY3MDQyLFZFUlNJT049MS4yLjM',
          acceptedScopes: ['pro', 'premium'],
          isProduction: true,
        }),
      ).to.equal(LicenseStatus.Invalid);
    });
  });

  describe('key version: 2', () => {
    const licenseKeyPro = generateLicense({
      expiryDate: new Date(releaseDate.getTime() + oneDayInMS),
      orderNumber: 'MUI-123',
      scope: 'pro',
      licensingModel: 'subscription',
    });

    const licenseKeyPremium = generateLicense({
      expiryDate: new Date(releaseDate.getTime() + oneDayInMS),
      orderNumber: 'MUI-123',
      scope: 'premium',
      licensingModel: 'subscription',
    });

    it('should log an error when ReleaseInfo is not valid', () => {
      expect(() =>
        verifyLicense({
          releaseInfo: '__RELEASE_INFO__',
          licenseKey: licenseKeyPro,
          acceptedScopes: ['pro', 'premium'],
          isProduction: true,
        }),
      ).to.throw('MUI: The release information is invalid. Not able to validate license.');
    });

    describe('scope', () => {
      it('should accept pro license for pro features', () => {
        expect(
          verifyLicense({
            releaseInfo: RELEASE_INFO,
            licenseKey: licenseKeyPro,
            acceptedScopes: ['pro', 'premium'],
            isProduction: true,
          }),
        ).to.equal(LicenseStatus.Valid);
      });

      it('should accept premium license for premium features', () => {
        expect(
          verifyLicense({
            releaseInfo: RELEASE_INFO,
            licenseKey: licenseKeyPremium,
            acceptedScopes: ['premium'],
            isProduction: true,
          }),
        ).to.equal(LicenseStatus.Valid);
      });

      it('should not accept pro license for premium feature', () => {
        expect(
          verifyLicense({
            releaseInfo: RELEASE_INFO,
            licenseKey: licenseKeyPro,
            acceptedScopes: ['premium'],
            isProduction: true,
          }),
        ).to.equal(LicenseStatus.Invalid);
      });
    });

    describe('expiry date', () => {
      it('should validate subscription license in prod if current date is after expiry date but release date is before expiry date', () => {
        const expiredLicenseKey = generateLicense({
          expiryDate: new Date(releaseDate.getTime() + oneDayInMS),
          orderNumber: 'MUI-123',
          licensingModel: 'subscription',
        });

        expect(
          verifyLicense({
            releaseInfo: RELEASE_INFO,
            licenseKey: expiredLicenseKey,
            acceptedScopes: ['pro', 'premium'],
            isProduction: true,
          }),
        ).to.equal(LicenseStatus.Valid);
      });

      it('should not validate subscription license in dev if current date is after expiry date but release date is before expiry date', () => {
        const expiredLicenseKey = generateLicense({
          expiryDate: new Date(releaseDate.getTime() + oneDayInMS),
          orderNumber: 'MUI-123',
          licensingModel: 'subscription',
        });

        expect(
          verifyLicense({
            releaseInfo: RELEASE_INFO,
            licenseKey: expiredLicenseKey,
            acceptedScopes: ['pro', 'premium'],
            isProduction: false,
          }),
        ).to.equal(LicenseStatus.Expired);
      });

      it('should validate perpetual license in dev if current date is after expiry date but release date is before expiry date', () => {
        const expiredLicenseKey = generateLicense({
          expiryDate: new Date(releaseDate.getTime() + oneDayInMS),
          orderNumber: 'MUI-123',
          licensingModel: 'perpetual',
        });

        expect(
          verifyLicense({
            releaseInfo: RELEASE_INFO,
            licenseKey: expiredLicenseKey,
            acceptedScopes: ['pro', 'premium'],
            isProduction: false,
          }),
        ).to.equal(LicenseStatus.Valid);
      });
    });

    it('should return Invalid for invalid license', () => {
      expect(
        verifyLicense({
          releaseInfo: RELEASE_INFO,
          licenseKey:
            'b43ff5f9ac93f021855ff59ff0ba5220TkFNRTpNYC1VSSBTQVMsREVWRUxPUEVSX0NPVU5UPTEwLEVYUElSWT0xNTkxNzIzMDY3MDQyLFZFUlNJT049MS4yLjM',
          acceptedScopes: ['pro', 'premium'],
          isProduction: true,
        }),
      ).to.equal(LicenseStatus.Invalid);
    });
  });
});
