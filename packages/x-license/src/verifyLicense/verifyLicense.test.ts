import { expect } from 'chai';
import { generateLicense } from '../generateLicense/generateLicense';
import { generateReleaseInfo, verifyLicense } from './verifyLicense';
import { LICENSE_STATUS } from '../utils/licenseStatus';

const oneDayInMS = 1000 * 60 * 60 * 24;
const releaseDate = new Date(2018, 0, 0, 0, 0, 0, 0);
const RELEASE_INFO = generateReleaseInfo(releaseDate);

describe('License: verifyLicense', () => {
  let env: any;

  beforeEach(() => {
    env = process.env.NODE_ENV;
    process.env.NODE_ENV = 'test';
  });

  afterEach(() => {
    process.env.NODE_ENV = env;
  });

  describe('key version: 1', () => {
    const licenseKey =
      '0f94d8b65161817ca5d7f7af8ac2f042T1JERVI6TVVJLVN0b3J5Ym9vayxFWFBJUlk9MTY1NDg1ODc1MzU1MCxLRVlWRVJTSU9OPTE=';

    it('should log an error when ReleaseInfo is not valid', () => {
      process.env.NODE_ENV = 'production';
      expect(
        () =>
          verifyLicense({
            releaseInfo: '__RELEASE_INFO__',
            licenseKey,
            packageName: 'x-data-grid-pro',
          }).status,
      ).to.throw('MUI X: The release information is invalid. Not able to validate license.');
    });

    it('should verify License properly', () => {
      process.env.NODE_ENV = 'production';
      expect(
        verifyLicense({
          releaseInfo: RELEASE_INFO,
          licenseKey,
          packageName: 'x-data-grid-pro',
        }).status,
      ).to.equal(LICENSE_STATUS.Valid);
    });

    it('should check expired license properly', () => {
      process.env.NODE_ENV = 'production';
      const expiredLicenseKey = generateLicense({
        expiryDate: new Date(releaseDate.getTime() - oneDayInMS),
        scope: 'pro',
        licensingModel: 'perpetual',
        orderNumber: 'MUI-123',
        planVersion: 'initial',
      });

      expect(
        verifyLicense({
          releaseInfo: RELEASE_INFO,
          licenseKey: expiredLicenseKey,
          packageName: 'x-data-grid-pro',
        }).status,
      ).to.equal(LICENSE_STATUS.ExpiredVersion);
    });

    it('should return Invalid for invalid license', () => {
      process.env.NODE_ENV = 'production';
      expect(
        verifyLicense({
          releaseInfo: RELEASE_INFO,
          licenseKey:
            'b43ff5f9ac93f021855ff59ff0ba5220TkFNRTpNYC1VSSBTQVMsREVWRUxPUEVSX0NPVU5UPTEwLEVYUElSWT0xNTkxNzIzMDY3MDQyLFZFUlNJT049MS4yLjM',
          packageName: 'x-data-grid-pro',
        }).status,
      ).to.equal(LICENSE_STATUS.Invalid);
    });
  });

  describe('key version: 2', () => {
    const licenseKeyPro = generateLicense({
      expiryDate: new Date(releaseDate.getTime() + oneDayInMS),
      orderNumber: 'MUI-123',
      scope: 'pro',
      licensingModel: 'subscription',
      planVersion: 'initial',
    });

    const licenseKeyPremium = generateLicense({
      expiryDate: new Date(releaseDate.getTime() + oneDayInMS),
      orderNumber: 'MUI-123',
      scope: 'premium',
      licensingModel: 'subscription',
      planVersion: 'initial',
    });

    it('should log an error when ReleaseInfo is not valid', () => {
      process.env.NODE_ENV = 'production';
      expect(
        () =>
          verifyLicense({
            releaseInfo: '__RELEASE_INFO__',
            licenseKey: licenseKeyPro,
            packageName: 'x-data-grid-pro',
          }).status,
      ).to.throw('MUI X: The release information is invalid. Not able to validate license.');
    });

    describe('scope', () => {
      it('should accept pro license for pro features', () => {
        process.env.NODE_ENV = 'production';
        expect(
          verifyLicense({
            releaseInfo: RELEASE_INFO,
            licenseKey: licenseKeyPro,
            packageName: 'x-data-grid-pro',
          }).status,
        ).to.equal(LICENSE_STATUS.Valid);
      });

      it('should accept premium license for premium features', () => {
        process.env.NODE_ENV = 'production';
        expect(
          verifyLicense({
            releaseInfo: RELEASE_INFO,
            licenseKey: licenseKeyPremium,
            packageName: 'x-data-grid-premium',
          }).status,
        ).to.equal(LICENSE_STATUS.Valid);
      });

      it('should not accept pro license for premium feature', () => {
        process.env.NODE_ENV = 'production';
        expect(
          verifyLicense({
            releaseInfo: RELEASE_INFO,
            licenseKey: licenseKeyPro,
            packageName: 'x-data-grid-premium',
          }).status,
        ).to.equal(LICENSE_STATUS.OutOfScope);
      });
    });

    describe('expiry date', () => {
      it('should validate subscription license in prod if current date is after expiry date but release date is before expiry date', () => {
        process.env.NODE_ENV = 'production';
        const expiredLicenseKey = generateLicense({
          expiryDate: new Date(releaseDate.getTime() + oneDayInMS),
          orderNumber: 'MUI-123',
          scope: 'pro',
          licensingModel: 'subscription',
          planVersion: 'initial',
        });

        expect(
          verifyLicense({
            releaseInfo: RELEASE_INFO,
            licenseKey: expiredLicenseKey,
            packageName: 'x-data-grid-pro',
          }).status,
        ).to.equal(LICENSE_STATUS.Valid);
      });

      it('should not validate subscription license in dev if current date is after expiry date but release date is before expiry date', () => {
        const expiredLicenseKey = generateLicense({
          expiryDate: new Date(new Date().getTime() - oneDayInMS),
          orderNumber: 'MUI-123',
          scope: 'pro',
          licensingModel: 'subscription',
          planVersion: 'initial',
        });

        expect(
          verifyLicense({
            releaseInfo: RELEASE_INFO,
            licenseKey: expiredLicenseKey,
            packageName: 'x-data-grid-pro',
          }).status,
        ).to.equal(LICENSE_STATUS.ExpiredAnnualGrace);
      });

      it('should throw if the license is expired by more than a 30 days', () => {
        process.env.NODE_ENV = 'development';
        const expiredLicenseKey = generateLicense({
          expiryDate: new Date(new Date().getTime() - oneDayInMS * 30),
          orderNumber: 'MUI-123',
          scope: 'pro',
          licensingModel: 'subscription',
          planVersion: 'initial',
        });

        expect(
          verifyLicense({
            releaseInfo: RELEASE_INFO,
            licenseKey: expiredLicenseKey,
            packageName: 'x-data-grid-pro',
          }).status,
        ).to.equal(LICENSE_STATUS.ExpiredAnnual);
      });

      it('should validate perpetual license in dev if current date is after expiry date but release date is before expiry date', () => {
        const expiredLicenseKey = generateLicense({
          expiryDate: new Date(releaseDate.getTime() + oneDayInMS),
          orderNumber: 'MUI-123',
          scope: 'pro',
          licensingModel: 'perpetual',
          planVersion: 'initial',
        });

        expect(
          verifyLicense({
            releaseInfo: RELEASE_INFO,
            licenseKey: expiredLicenseKey,
            packageName: 'x-data-grid-pro',
          }).status,
        ).to.equal(LICENSE_STATUS.Valid);
      });
    });

    it('should return Invalid for invalid license', () => {
      process.env.NODE_ENV = 'production';
      expect(
        verifyLicense({
          releaseInfo: RELEASE_INFO,
          licenseKey:
            'b43ff5f9ac93f021855ff59ff0ba5220TkFNRTpNYC1VSSBTQVMsREVWRUxPUEVSX0NPVU5UPTEwLEVYUElSWT0xNTkxNzIzMDY3MDQyLFZFUlNJT049MS4yLjM',
          packageName: 'x-data-grid-pro',
        }).status,
      ).to.equal(LICENSE_STATUS.Invalid);
    });
  });

  describe('key version: 2.1', () => {
    const licenseKeyPro = generateLicense({
      expiryDate: new Date(releaseDate.getTime() + oneDayInMS),
      orderNumber: 'MUI-123',
      scope: 'pro',
      licensingModel: 'annual',
      planVersion: 'initial',
    });

    it('should accept licensingModel="annual"', () => {
      process.env.NODE_ENV = 'production';
      expect(
        verifyLicense({
          releaseInfo: RELEASE_INFO,
          licenseKey: licenseKeyPro,
          packageName: 'x-data-grid-pro',
        }).status,
      ).to.equal(LICENSE_STATUS.Valid);
    });
  });

  describe('key version: 2.2', () => {
    const proLicenseKeyInitial = generateLicense({
      expiryDate: new Date(releaseDate.getTime() + oneDayInMS),
      orderNumber: 'MUI-123',
      scope: 'pro',
      licensingModel: 'annual',
      planVersion: 'initial',
    });

    const premiumLicenseKeyInitial = generateLicense({
      expiryDate: new Date(releaseDate.getTime() + oneDayInMS),
      orderNumber: 'MUI-123',
      scope: 'premium',
      licensingModel: 'annual',
      planVersion: 'initial',
    });

    const proLicenseKeyQ32024 = generateLicense({
      expiryDate: new Date(releaseDate.getTime() + oneDayInMS),
      orderNumber: 'MUI-123',
      scope: 'pro',
      licensingModel: 'annual',
      planVersion: 'Q3-2024',
    });

    it('PlanVersion "initial" should not accept x-charts-pro', () => {
      process.env.NODE_ENV = 'production';
      expect(
        verifyLicense({
          releaseInfo: RELEASE_INFO,
          licenseKey: proLicenseKeyInitial,
          packageName: 'x-charts-pro',
        }).status,
      ).to.equal(LICENSE_STATUS.NotAvailableInInitialProPlan);
    });

    it('PlanVersion "initial" should not accept x-tree-view-pro', () => {
      process.env.NODE_ENV = 'production';
      expect(
        verifyLicense({
          releaseInfo: RELEASE_INFO,
          licenseKey: proLicenseKeyInitial,
          packageName: 'x-tree-view-pro',
        }).status,
      ).to.equal(LICENSE_STATUS.NotAvailableInInitialProPlan);
    });

    it('PlanVersion "Q3-2024" should accept x-charts-pro', () => {
      process.env.NODE_ENV = 'production';
      expect(
        verifyLicense({
          releaseInfo: RELEASE_INFO,
          licenseKey: proLicenseKeyQ32024,
          packageName: 'x-charts-pro',
        }).status,
      ).to.equal(LICENSE_STATUS.Valid);
    });

    it('PlanVersion "Q3-2024" should accept x-tree-view-pro', () => {
      process.env.NODE_ENV = 'production';
      expect(
        verifyLicense({
          releaseInfo: RELEASE_INFO,
          licenseKey: proLicenseKeyQ32024,
          packageName: 'x-tree-view-pro',
        }).status,
      ).to.equal(LICENSE_STATUS.Valid);
    });

    it('Premium with planVersion "initial" should accept x-tree-view-pro', () => {
      process.env.NODE_ENV = 'production';
      expect(
        verifyLicense({
          releaseInfo: RELEASE_INFO,
          licenseKey: premiumLicenseKeyInitial,
          packageName: 'x-tree-view-pro',
        }).status,
      ).to.equal(LICENSE_STATUS.Valid);
    });

    it('Premium with planVersion "initial" should accept x-charts-pro', () => {
      process.env.NODE_ENV = 'production';
      expect(
        verifyLicense({
          releaseInfo: RELEASE_INFO,
          licenseKey: premiumLicenseKeyInitial,
          packageName: 'x-charts-pro',
        }).status,
      ).to.equal(LICENSE_STATUS.Valid);
    });
  });
});
