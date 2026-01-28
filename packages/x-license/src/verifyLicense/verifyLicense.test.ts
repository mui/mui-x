import { vi } from 'vitest';
import { isJSDOM } from 'test/utils/skipIf';
import { generateLicense } from '../generateLicense/generateLicense';
import { generateReleaseInfo, verifyLicense } from './verifyLicense';
import { LICENSE_STATUS } from '../utils/licenseStatus';

const oneDayInMS = 1000 * 60 * 60 * 24;
const releaseDate = new Date(2018, 0, 0, 0, 0, 0, 0);
const RELEASE_INFO = generateReleaseInfo(releaseDate);

// Can't change the process.env.NODE_ENV in Browser
describe.skipIf(!isJSDOM)('License: verifyLicense', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('key version: 1', () => {
    const licenseKey =
      '65897de688b8bed993b1d6ddd0e1d548T1JERVI6MTIzLEVYUElSWT0xNzg1ODc0MDEwNzA4LEtFWVZFUlNJT049MQ==';

    it('should log an error when ReleaseInfo is not valid', () => {
      vi.stubEnv('NODE_ENV', 'production');
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
      vi.stubEnv('NODE_ENV', 'production');
      expect(
        verifyLicense({
          releaseInfo: RELEASE_INFO,
          licenseKey,
          packageName: 'x-data-grid-pro',
        }).status,
      ).to.equal(LICENSE_STATUS.Valid);
    });

    it('should check expired license properly', () => {
      vi.stubEnv('NODE_ENV', 'production');
      const expiredLicenseKey = generateLicense({
        expiryDate: new Date(releaseDate.getTime() - oneDayInMS),
        planScope: 'pro',
        licenseModel: 'perpetual',
        orderNumber: '123',
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
      vi.stubEnv('NODE_ENV', 'production');
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
      orderNumber: '123',
      planScope: 'pro',
      licenseModel: 'subscription',
      planVersion: 'initial',
    });

    const licenseKeyPremium = generateLicense({
      expiryDate: new Date(releaseDate.getTime() + oneDayInMS),
      orderNumber: '123',
      planScope: 'premium',
      licenseModel: 'subscription',
      planVersion: 'initial',
    });

    it('should log an error when ReleaseInfo is not valid', () => {
      vi.stubEnv('NODE_ENV', 'production');
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
        vi.stubEnv('NODE_ENV', 'production');
        expect(
          verifyLicense({
            releaseInfo: RELEASE_INFO,
            licenseKey: licenseKeyPro,
            packageName: 'x-data-grid-pro',
          }).status,
        ).to.equal(LICENSE_STATUS.Valid);
      });

      it('should accept premium license for premium features', () => {
        vi.stubEnv('NODE_ENV', 'production');
        expect(
          verifyLicense({
            releaseInfo: RELEASE_INFO,
            licenseKey: licenseKeyPremium,
            packageName: 'x-data-grid-premium',
          }).status,
        ).to.equal(LICENSE_STATUS.Valid);
      });

      it('should not accept pro license for premium feature', () => {
        vi.stubEnv('NODE_ENV', 'production');
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
        vi.stubEnv('NODE_ENV', 'production');
        const expiredLicenseKey = generateLicense({
          expiryDate: new Date(releaseDate.getTime() + oneDayInMS),
          orderNumber: '123',
          planScope: 'pro',
          licenseModel: 'subscription',
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
          orderNumber: '123',
          planScope: 'pro',
          licenseModel: 'subscription',
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
        vi.stubEnv('IS_TEST_ENV', undefined);

        const expiredLicenseKey = generateLicense({
          expiryDate: new Date(new Date().getTime() - oneDayInMS * 30),
          orderNumber: '123',
          planScope: 'pro',
          licenseModel: 'subscription',
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
          orderNumber: '123',
          planScope: 'pro',
          licenseModel: 'perpetual',
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
      vi.stubEnv('NODE_ENV', 'production');
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
      orderNumber: '123',
      planScope: 'pro',
      licenseModel: 'annual',
      planVersion: 'initial',
    });

    it('should accept licenseModel="annual"', () => {
      vi.stubEnv('NODE_ENV', 'production');
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
      orderNumber: '123',
      planScope: 'pro',
      licenseModel: 'annual',
      planVersion: 'initial',
    });

    const premiumLicenseKeyInitial = generateLicense({
      expiryDate: new Date(releaseDate.getTime() + oneDayInMS),
      orderNumber: '123',
      planScope: 'premium',
      licenseModel: 'annual',
      planVersion: 'initial',
    });

    const proLicenseKeyQ32024 = generateLicense({
      expiryDate: new Date(releaseDate.getTime() + oneDayInMS),
      orderNumber: '123',
      planScope: 'pro',
      licenseModel: 'annual',
      planVersion: 'Q3-2024',
    });

    it('PlanVersion "initial" should not accept x-charts-pro', () => {
      vi.stubEnv('NODE_ENV', 'production');
      expect(
        verifyLicense({
          releaseInfo: RELEASE_INFO,
          licenseKey: proLicenseKeyInitial,
          packageName: 'x-charts-pro',
        }).status,
      ).to.equal(LICENSE_STATUS.NotAvailableInInitialProPlan);
    });

    it('PlanVersion "initial" should not accept x-tree-view-pro', () => {
      vi.stubEnv('NODE_ENV', 'production');
      expect(
        verifyLicense({
          releaseInfo: RELEASE_INFO,
          licenseKey: proLicenseKeyInitial,
          packageName: 'x-tree-view-pro',
        }).status,
      ).to.equal(LICENSE_STATUS.NotAvailableInInitialProPlan);
    });

    it('PlanVersion "Q3-2024" should accept x-charts-pro', () => {
      vi.stubEnv('NODE_ENV', 'production');
      expect(
        verifyLicense({
          releaseInfo: RELEASE_INFO,
          licenseKey: proLicenseKeyQ32024,
          packageName: 'x-charts-pro',
        }).status,
      ).to.equal(LICENSE_STATUS.Valid);
    });

    it('PlanVersion "Q3-2024" should accept x-tree-view-pro', () => {
      vi.stubEnv('NODE_ENV', 'production');
      expect(
        verifyLicense({
          releaseInfo: RELEASE_INFO,
          licenseKey: proLicenseKeyQ32024,
          packageName: 'x-tree-view-pro',
        }).status,
      ).to.equal(LICENSE_STATUS.Valid);
    });

    it('Premium with planVersion "initial" should accept x-tree-view-pro', () => {
      vi.stubEnv('NODE_ENV', 'production');
      expect(
        verifyLicense({
          releaseInfo: RELEASE_INFO,
          licenseKey: premiumLicenseKeyInitial,
          packageName: 'x-tree-view-pro',
        }).status,
      ).to.equal(LICENSE_STATUS.Valid);
    });

    it('Premium with planVersion "initial" should accept x-charts-pro', () => {
      vi.stubEnv('NODE_ENV', 'production');
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
