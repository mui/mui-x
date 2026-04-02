import { vi } from 'vitest';
import { isJSDOM } from 'test/utils/skipIf';
// eslint-disable-next-line import/extensions
import generateReleaseInfo from '../../../../scripts/generateReleaseInfo.mjs';
import {
  verifyLicense,
  parseLicenseTokens,
  decodeLicense,
  decodeLicenseVersion2,
  decodeLicenseVersion3,
} from './verifyLicense';
import { LICENSE_STATUS } from '../utils/licenseStatus';
import { NullableLicenseDetails } from '../utils/licenseDetails';
import {
  TEST_LICENSE_KEY_PRO,
  TEST_KEY_V1,
  TEST_KEY_PRO_SUBSCRIPTION,
  TEST_KEY_PREMIUM_SUBSCRIPTION,
  TEST_KEY_PRO_PERPETUAL,
  TEST_KEY_PRO_PERPETUAL_EXPIRED,
  TEST_KEY_PRO_ANNUAL_INITIAL,
  TEST_KEY_PREMIUM_ANNUAL_INITIAL,
  TEST_KEY_EXPIRED_GRACE,
  TEST_KEY_EXPIRED_30DAYS,
  TEST_KEY_PRO_ANNUAL_V3,
  TEST_KEY_PRO_ANNUAL_Q1_2026_V3,
  TEST_KEY_PREMIUM_ANNUAL_Q1_2026_V3,
  TEST_KEY_PRO_PERPETUAL_Q1_2026,
  TEST_KEY_PRO_PERPETUAL_Q1_2026_EXPIRED,
  TEST_KEY_INVALID,
  TEST_KEY_UNKNOWN_VERSION,
} from '../test-keys';

const releaseDate = new Date(2018, 0, 0, 0, 0, 0, 0);
const RELEASE_INFO = generateReleaseInfo(releaseDate);

// Can't change the process.env.NODE_ENV in Browser
describe.skipIf(!isJSDOM)('License: verifyLicense', () => {
  let env: any;

  beforeEach(() => {
    env = process.env.NODE_ENV;
    process.env.NODE_ENV = 'test';
  });

  afterEach(() => {
    process.env.NODE_ENV = env;
  });

  describe('verifyLicense', () => {
    describe('key version: 1', () => {
      it('should log an error when ReleaseInfo is not valid', () => {
        process.env.NODE_ENV = 'production';
        expect(
          () =>
            verifyLicense({
              packageInfo: {
                releaseDate: '__RELEASE_INFO__',
                version: '',
                name: 'x-data-grid-pro',
              },
              licenseKey: TEST_KEY_V1,
            }).status,
        ).to.throw(
          'MUI X: The release information is invalid and license validation cannot proceed. The package release timestamp could not be parsed. This may indicate a corrupted package. Try reinstalling the MUI X packages.',
        );
      });

      it('should verify License properly', () => {
        process.env.NODE_ENV = 'production';
        expect(
          verifyLicense({
            packageInfo: { releaseDate: RELEASE_INFO, version: '', name: 'x-data-grid-pro' },
            licenseKey: TEST_KEY_V1,
          }).status,
        ).to.equal(LICENSE_STATUS.Valid);
      });

      it('should check expired license properly', () => {
        process.env.NODE_ENV = 'production';
        expect(
          verifyLicense({
            packageInfo: { releaseDate: RELEASE_INFO, version: '', name: 'x-data-grid-pro' },
            licenseKey: TEST_KEY_PRO_PERPETUAL_EXPIRED,
          }).status,
        ).to.equal(LICENSE_STATUS.ExpiredVersion);
      });

      it('should return Invalid for invalid license', () => {
        process.env.NODE_ENV = 'production';
        expect(
          verifyLicense({
            packageInfo: { releaseDate: RELEASE_INFO, version: '', name: 'x-data-grid-pro' },
            licenseKey: TEST_KEY_INVALID,
          }).status,
        ).to.equal(LICENSE_STATUS.Invalid);
      });
    });

    describe('key version: 2', () => {
      it('should log an error when ReleaseInfo is not valid', () => {
        process.env.NODE_ENV = 'production';
        expect(
          () =>
            verifyLicense({
              packageInfo: {
                releaseDate: '__RELEASE_INFO__',
                version: '',
                name: 'x-data-grid-pro',
              },
              licenseKey: TEST_KEY_PRO_SUBSCRIPTION,
            }).status,
        ).to.throw(
          'MUI X: The release information is invalid and license validation cannot proceed. The package release timestamp could not be parsed. This may indicate a corrupted package. Try reinstalling the MUI X packages.',
        );
      });

      describe('scope', () => {
        it('should accept pro license for pro features', () => {
          process.env.NODE_ENV = 'production';
          expect(
            verifyLicense({
              packageInfo: { releaseDate: RELEASE_INFO, version: '', name: 'x-data-grid-pro' },
              licenseKey: TEST_KEY_PRO_SUBSCRIPTION,
            }).status,
          ).to.equal(LICENSE_STATUS.Valid);
        });

        it('should accept premium license for premium features', () => {
          process.env.NODE_ENV = 'production';
          expect(
            verifyLicense({
              packageInfo: { releaseDate: RELEASE_INFO, version: '', name: 'x-data-grid-premium' },
              licenseKey: TEST_KEY_PREMIUM_SUBSCRIPTION,
            }).status,
          ).to.equal(LICENSE_STATUS.Valid);
        });

        it('should not accept pro license for premium feature', () => {
          process.env.NODE_ENV = 'production';
          expect(
            verifyLicense({
              packageInfo: { releaseDate: RELEASE_INFO, version: '', name: 'x-data-grid-premium' },
              licenseKey: TEST_KEY_PRO_SUBSCRIPTION,
            }).status,
          ).to.equal(LICENSE_STATUS.OutOfScope);
        });
      });

      describe('expiry date', () => {
        it('should validate subscription license in prod if current date is after expiry date but release date is before expiry date', () => {
          process.env.NODE_ENV = 'production';
          expect(
            verifyLicense({
              packageInfo: { releaseDate: RELEASE_INFO, version: '', name: 'x-data-grid-pro' },
              licenseKey: TEST_KEY_PRO_SUBSCRIPTION,
            }).status,
          ).to.equal(LICENSE_STATUS.Valid);
        });

        it('should not validate subscription license in dev if current date is after expiry date but release date is before expiry date', () => {
          vi.useFakeTimers();
          vi.setSystemTime(new Date('2024-06-15T00:00:00.000Z'));

          try {
            expect(
              verifyLicense({
                packageInfo: { releaseDate: RELEASE_INFO, version: '', name: 'x-data-grid-pro' },
                licenseKey: TEST_KEY_EXPIRED_GRACE,
              }).status,
            ).to.equal(LICENSE_STATUS.ExpiredAnnualGrace);
          } finally {
            vi.useRealTimers();
          }
        });

        it('should throw if the license is expired by more than a 30 days', () => {
          process.env.NODE_ENV = 'development';

          vi.useFakeTimers();
          vi.setSystemTime(new Date('2024-06-15T00:00:00.000Z'));

          try {
            expect(
              verifyLicense({
                packageInfo: { releaseDate: RELEASE_INFO, version: '', name: 'x-data-grid-pro' },
                licenseKey: TEST_KEY_EXPIRED_30DAYS,
              }).status,
            ).to.equal(LICENSE_STATUS.ExpiredAnnual);
          } finally {
            vi.useRealTimers();
          }
        });

        it('should validate perpetual license in dev if current date is after expiry date but release date is before expiry date', () => {
          expect(
            verifyLicense({
              packageInfo: { releaseDate: RELEASE_INFO, version: '', name: 'x-data-grid-pro' },
              licenseKey: TEST_KEY_PRO_PERPETUAL,
            }).status,
          ).to.equal(LICENSE_STATUS.Valid);
        });
      });

      it('should return Invalid for invalid license', () => {
        process.env.NODE_ENV = 'production';
        expect(
          verifyLicense({
            packageInfo: { releaseDate: RELEASE_INFO, version: '', name: 'x-data-grid-pro' },
            licenseKey: TEST_KEY_INVALID,
          }).status,
        ).to.equal(LICENSE_STATUS.Invalid);
      });
    });

    describe('key version: 2.1', () => {
      it('should accept licenseModel="annual"', () => {
        process.env.NODE_ENV = 'production';
        expect(
          verifyLicense({
            packageInfo: { releaseDate: RELEASE_INFO, version: '', name: 'x-data-grid-pro' },
            licenseKey: TEST_KEY_PRO_ANNUAL_INITIAL,
          }).status,
        ).to.equal(LICENSE_STATUS.Valid);
      });
    });

    describe('key version: 2.2', () => {
      it('PlanVersion "initial" should not accept x-charts-pro', () => {
        process.env.NODE_ENV = 'production';
        expect(
          verifyLicense({
            packageInfo: { releaseDate: RELEASE_INFO, version: '', name: 'x-charts-pro' },
            licenseKey: TEST_KEY_PRO_ANNUAL_INITIAL,
          }).status,
        ).to.equal(LICENSE_STATUS.NotAvailableInInitialProPlan);
      });

      it('PlanVersion "initial" should not accept x-tree-view-pro', () => {
        process.env.NODE_ENV = 'production';
        expect(
          verifyLicense({
            packageInfo: { releaseDate: RELEASE_INFO, version: '', name: 'x-tree-view-pro' },
            licenseKey: TEST_KEY_PRO_ANNUAL_INITIAL,
          }).status,
        ).to.equal(LICENSE_STATUS.NotAvailableInInitialProPlan);
      });

      it('PlanVersion "Q3-2024" should accept x-charts-pro', () => {
        process.env.NODE_ENV = 'production';
        expect(
          verifyLicense({
            packageInfo: { releaseDate: RELEASE_INFO, version: '', name: 'x-charts-pro' },
            licenseKey: TEST_LICENSE_KEY_PRO,
          }).status,
        ).to.equal(LICENSE_STATUS.Valid);
      });

      it('PlanVersion "Q3-2024" should accept x-tree-view-pro', () => {
        process.env.NODE_ENV = 'production';
        expect(
          verifyLicense({
            packageInfo: { releaseDate: RELEASE_INFO, version: '', name: 'x-tree-view-pro' },
            licenseKey: TEST_LICENSE_KEY_PRO,
          }).status,
        ).to.equal(LICENSE_STATUS.Valid);
      });

      it('Premium with planVersion "initial" should accept x-tree-view-pro', () => {
        process.env.NODE_ENV = 'production';
        expect(
          verifyLicense({
            packageInfo: { releaseDate: RELEASE_INFO, version: '', name: 'x-tree-view-pro' },
            licenseKey: TEST_KEY_PREMIUM_ANNUAL_INITIAL,
          }).status,
        ).to.equal(LICENSE_STATUS.Valid);
      });

      it('Premium with planVersion "initial" should accept x-charts-pro', () => {
        process.env.NODE_ENV = 'production';
        expect(
          verifyLicense({
            packageInfo: { releaseDate: RELEASE_INFO, version: '', name: 'x-charts-pro' },
            licenseKey: TEST_KEY_PREMIUM_ANNUAL_INITIAL,
          }).status,
        ).to.equal(LICENSE_STATUS.Valid);
      });
    });
  });

  describe('key version: 3', () => {
    it('should verify a v3 pro license for pro features', () => {
      process.env.NODE_ENV = 'production';
      expect(
        verifyLicense({
          packageInfo: { releaseDate: RELEASE_INFO, version: '', name: 'x-data-grid-pro' },
          licenseKey: TEST_KEY_PRO_ANNUAL_V3,
        }).status,
      ).to.equal(LICENSE_STATUS.Valid);
    });

    it('should not accept a v3 pro license for premium features', () => {
      process.env.NODE_ENV = 'production';
      expect(
        verifyLicense({
          packageInfo: { releaseDate: RELEASE_INFO, version: '', name: 'x-data-grid-premium' },
          licenseKey: TEST_KEY_PRO_ANNUAL_V3,
        }).status,
      ).to.equal(LICENSE_STATUS.OutOfScope);
    });
  });

  describe('key version: 3 (Q1-2026)', () => {
    it('should verify a v3 pro Q1-2026 license for pro features', () => {
      process.env.NODE_ENV = 'production';
      expect(
        verifyLicense({
          packageInfo: { releaseDate: RELEASE_INFO, version: '', name: 'x-data-grid-pro' },
          licenseKey: TEST_KEY_PRO_ANNUAL_Q1_2026_V3,
        }).status,
      ).to.equal(LICENSE_STATUS.Valid);
    });

    it('should verify a v3 pro Q1-2026 license for x-charts-pro', () => {
      process.env.NODE_ENV = 'production';
      expect(
        verifyLicense({
          packageInfo: { releaseDate: RELEASE_INFO, version: '', name: 'x-charts-pro' },
          licenseKey: TEST_KEY_PRO_ANNUAL_Q1_2026_V3,
        }).status,
      ).to.equal(LICENSE_STATUS.Valid);
    });

    it('should verify a v3 pro Q1-2026 license for x-tree-view-pro', () => {
      process.env.NODE_ENV = 'production';
      expect(
        verifyLicense({
          packageInfo: { releaseDate: RELEASE_INFO, version: '', name: 'x-tree-view-pro' },
          licenseKey: TEST_KEY_PRO_ANNUAL_Q1_2026_V3,
        }).status,
      ).to.equal(LICENSE_STATUS.Valid);
    });

    it('should not accept a v3 pro Q1-2026 license for premium features', () => {
      process.env.NODE_ENV = 'production';
      expect(
        verifyLicense({
          packageInfo: { releaseDate: RELEASE_INFO, version: '', name: 'x-data-grid-premium' },
          licenseKey: TEST_KEY_PRO_ANNUAL_Q1_2026_V3,
        }).status,
      ).to.equal(LICENSE_STATUS.OutOfScope);
    });

    it('should verify a v3 premium Q1-2026 license for premium features', () => {
      process.env.NODE_ENV = 'production';
      expect(
        verifyLicense({
          packageInfo: { releaseDate: RELEASE_INFO, version: '', name: 'x-data-grid-premium' },
          licenseKey: TEST_KEY_PREMIUM_ANNUAL_Q1_2026_V3,
        }).status,
      ).to.equal(LICENSE_STATUS.Valid);
    });

    it('should verify a v3 premium Q1-2026 license for pro features', () => {
      process.env.NODE_ENV = 'production';
      expect(
        verifyLicense({
          packageInfo: { releaseDate: RELEASE_INFO, version: '', name: 'x-data-grid-pro' },
          licenseKey: TEST_KEY_PREMIUM_ANNUAL_Q1_2026_V3,
        }).status,
      ).to.equal(LICENSE_STATUS.Valid);
    });

    it('should decode quantity and appType from a Q1-2026 v3 pro key', () => {
      const encoded = TEST_KEY_PRO_ANNUAL_Q1_2026_V3.slice(32);
      const result = decodeLicense(encoded);

      expect(result).to.not.equal(null);
      expect(result!.keyVersion).to.equal(3);
      expect(result!.planScope).to.equal('pro');
      expect(result!.licenseModel).to.equal('annual');
      expect(result!.planVersion).to.equal('Q1-2026');
      expect(result!.quantity).to.equal(5);
      expect(result!.appType).to.equal('single');
    });

    it('should decode quantity and appType from a Q1-2026 v3 premium key', () => {
      const encoded = TEST_KEY_PREMIUM_ANNUAL_Q1_2026_V3.slice(32);
      const result = decodeLicense(encoded);

      expect(result).to.not.equal(null);
      expect(result!.keyVersion).to.equal(3);
      expect(result!.planScope).to.equal('premium');
      expect(result!.licenseModel).to.equal('annual');
      expect(result!.planVersion).to.equal('Q1-2026');
      expect(result!.quantity).to.equal(10);
      expect(result!.appType).to.equal('single');
    });
  });

  describe('NotValidForPackage (v9 plan version check)', () => {
    describe('annual/subscription licenses', () => {
      it('should reject annual license with planVersion "initial"', () => {
        process.env.NODE_ENV = 'production';
        expect(
          verifyLicense({
            packageInfo: { releaseDate: RELEASE_INFO, version: '9.0.0', name: 'x-data-grid-pro' },
            licenseKey: TEST_KEY_PRO_ANNUAL_INITIAL,
          }).status,
        ).to.equal(LICENSE_STATUS.NotValidForPackage);
      });

      it('should reject subscription license with planVersion "initial"', () => {
        process.env.NODE_ENV = 'production';
        expect(
          verifyLicense({
            packageInfo: { releaseDate: RELEASE_INFO, version: '9.0.0', name: 'x-data-grid-pro' },
            licenseKey: TEST_KEY_PRO_SUBSCRIPTION,
          }).status,
        ).to.equal(LICENSE_STATUS.NotValidForPackage);
      });

      it('should reject annual license with planVersion "Q3-2024"', () => {
        process.env.NODE_ENV = 'production';
        expect(
          verifyLicense({
            packageInfo: { releaseDate: RELEASE_INFO, version: '9.0.0', name: 'x-data-grid-pro' },
            licenseKey: TEST_KEY_PRO_ANNUAL_V3,
          }).status,
        ).to.equal(LICENSE_STATUS.NotValidForPackage);
      });

      it('should accept annual license with planVersion "Q1-2026"', () => {
        process.env.NODE_ENV = 'production';
        expect(
          verifyLicense({
            packageInfo: { releaseDate: RELEASE_INFO, version: '9.0.0', name: 'x-data-grid-pro' },
            licenseKey: TEST_KEY_PRO_ANNUAL_Q1_2026_V3,
          }).status,
        ).to.equal(LICENSE_STATUS.Valid);
      });
    });

    describe('perpetual licenses', () => {
      it('should accept perpetual v8 license when package release is before expiry', () => {
        process.env.NODE_ENV = 'production';
        expect(
          verifyLicense({
            packageInfo: { releaseDate: RELEASE_INFO, version: '9.0.0', name: 'x-data-grid-pro' },
            licenseKey: TEST_KEY_PRO_PERPETUAL_Q1_2026,
          }).status,
        ).to.equal(LICENSE_STATUS.Valid);
      });

      it('should accept perpetual v8 license (initial) when package release is before expiry', () => {
        process.env.NODE_ENV = 'production';
        expect(
          verifyLicense({
            packageInfo: { releaseDate: RELEASE_INFO, version: '9.0.0', name: 'x-data-grid-pro' },
            licenseKey: TEST_KEY_PRO_PERPETUAL,
          }).status,
        ).to.equal(LICENSE_STATUS.Valid);
      });

      it('should reject perpetual Q1-2026 license when package release is after expiry (ExpiredVersion, not v8 check)', () => {
        process.env.NODE_ENV = 'production';
        expect(
          verifyLicense({
            packageInfo: { releaseDate: RELEASE_INFO, version: '9.0.0', name: 'x-data-grid-pro' },
            licenseKey: TEST_KEY_PRO_PERPETUAL_Q1_2026_EXPIRED,
          }).status,
        ).to.equal(LICENSE_STATUS.ExpiredVersion);
      });

      it('should reject perpetual v8 license (initial) when package release is after expiry', () => {
        process.env.NODE_ENV = 'production';
        expect(
          verifyLicense({
            packageInfo: { releaseDate: RELEASE_INFO, version: '9.0.0', name: 'x-data-grid-pro' },
            licenseKey: TEST_KEY_PRO_PERPETUAL_EXPIRED,
          }).status,
        ).to.equal(LICENSE_STATUS.NotValidForPackage);
      });

      it('should accept v1 perpetual license when package release is before expiry', () => {
        process.env.NODE_ENV = 'production';
        expect(
          verifyLicense({
            packageInfo: { releaseDate: RELEASE_INFO, version: '9.0.0', name: 'x-data-grid-pro' },
            licenseKey: TEST_KEY_V1,
          }).status,
        ).to.equal(LICENSE_STATUS.Valid);
      });
    });
  });

  describe('parseLicenseTokens', () => {
    it('should parse all v2 tokens', () => {
      const licenseInfo: NullableLicenseDetails = {
        keyVersion: 2,
        licenseModel: null,
        planScope: null,
        planVersion: 'initial',
        expiryTimestamp: null,
        expiryDate: null,
        orderId: null,
        appType: 'multi',
        quantity: null,
        isTestKey: false,
      };

      parseLicenseTokens(
        'O=123,E=1514761200000,S=pro,LM=annual,PV=Q3-2024,T=true,KV=2',
        licenseInfo,
      );

      expect(licenseInfo.orderId).to.equal('123');
      expect(licenseInfo.expiryTimestamp).to.equal(1514761200000);
      expect(licenseInfo.expiryDate).to.deep.equal(new Date(1514761200000));
      expect(licenseInfo.planScope).to.equal('pro');
      expect(licenseInfo.licenseModel).to.equal('annual');
      expect(licenseInfo.planVersion).to.equal('Q3-2024');
      expect(licenseInfo.isTestKey).to.equal(true);
    });

    it('should parse quantity and appType tokens (v3)', () => {
      const licenseInfo: NullableLicenseDetails = {
        keyVersion: 3,
        licenseModel: null,
        planScope: null,
        planVersion: 'initial',
        expiryTimestamp: null,
        expiryDate: null,
        orderId: null,
        appType: null,
        quantity: null,
        isTestKey: false,
      };

      parseLicenseTokens(
        'O=456,E=1514761200000,S=premium,LM=annual,PV=Q3-2024,Q=5,AT=single,KV=3',
        licenseInfo,
      );

      expect(licenseInfo.quantity).to.equal(5);
      expect(licenseInfo.appType).to.equal('single');
      expect(licenseInfo.orderId).to.equal('456');
      expect(licenseInfo.planScope).to.equal('premium');
    });

    it('should parse Q1-2026 planVersion with quantity and appType (v3)', () => {
      const licenseInfo: NullableLicenseDetails = {
        keyVersion: 3,
        licenseModel: null,
        planScope: null,
        planVersion: 'initial',
        expiryTimestamp: null,
        expiryDate: null,
        orderId: null,
        appType: null,
        quantity: null,
        isTestKey: false,
      };

      parseLicenseTokens(
        'O=789,E=1514761200000,S=pro,LM=annual,PV=Q1-2026,Q=5,AT=single,KV=3',
        licenseInfo,
      );

      expect(licenseInfo.planVersion).to.equal('Q1-2026');
      expect(licenseInfo.quantity).to.equal(5);
      expect(licenseInfo.appType).to.equal('single');
      expect(licenseInfo.orderId).to.equal('789');
      expect(licenseInfo.planScope).to.equal('pro');
    });

    it('should ignore invalid numeric values', () => {
      const licenseInfo: NullableLicenseDetails = {
        keyVersion: 3,
        licenseModel: null,
        planScope: null,
        planVersion: 'initial',
        expiryTimestamp: null,
        expiryDate: null,
        orderId: null,
        appType: null,
        quantity: null,
        isTestKey: false,
      };

      parseLicenseTokens('O=abc,E=xyz,Q=notanumber,KV=3', licenseInfo);

      expect(licenseInfo.orderId).to.equal('abc');
      expect(licenseInfo.expiryTimestamp).to.equal(null);
      expect(licenseInfo.quantity).to.equal(null);
    });
  });

  describe('decodeLicenseVersion2', () => {
    it('should decode a v2 license string', () => {
      const result = decodeLicenseVersion2(
        'O=123,E=1514761200000,S=pro,LM=subscription,PV=initial,KV=2',
      );

      expect(result.keyVersion).to.equal(2);
      expect(result.orderId).to.equal('123');
      expect(result.planScope).to.equal('pro');
      expect(result.licenseModel).to.equal('subscription');
      expect(result.planVersion).to.equal('initial');
      expect(result.expiryTimestamp).to.equal(1514761200000);
      expect(result.appType).to.equal('multi');
      expect(result.quantity).to.equal(null);
      expect(result.isTestKey).to.equal(false);
    });

    it('should default appType to multi for v2', () => {
      const result = decodeLicenseVersion2('O=123,E=1514761200000,S=pro,LM=annual,PV=Q3-2024,KV=2');

      expect(result.appType).to.equal('multi');
    });
  });

  describe('decodeLicenseVersion3', () => {
    it('should decode a v3 license string with quantity and appType', () => {
      const result = decodeLicenseVersion3(
        'O=789,E=1514761200000,S=premium,LM=annual,PV=Q3-2024,Q=10,AT=single,KV=3',
      );

      expect(result.keyVersion).to.equal(3);
      expect(result.orderId).to.equal('789');
      expect(result.planScope).to.equal('premium');
      expect(result.licenseModel).to.equal('annual');
      expect(result.planVersion).to.equal('Q3-2024');
      expect(result.expiryTimestamp).to.equal(1514761200000);
      expect(result.quantity).to.equal(10);
      expect(result.appType).to.equal('single');
      expect(result.isTestKey).to.equal(false);
    });

    it('should default appType to null for v3', () => {
      const result = decodeLicenseVersion3('O=123,E=1514761200000,S=pro,LM=annual,PV=Q3-2024,KV=3');

      expect(result.appType).to.equal(null);
      expect(result.quantity).to.equal(null);
    });

    it('should decode a v3 license string with Q1-2026 planVersion', () => {
      const result = decodeLicenseVersion3(
        'O=123,E=4102354800000,S=pro,LM=annual,PV=Q1-2026,Q=5,AT=single,T=true,KV=3',
      );

      expect(result.keyVersion).to.equal(3);
      expect(result.orderId).to.equal('123');
      expect(result.planScope).to.equal('pro');
      expect(result.licenseModel).to.equal('annual');
      expect(result.planVersion).to.equal('Q1-2026');
      expect(result.expiryTimestamp).to.equal(4102354800000);
      expect(result.quantity).to.equal(5);
      expect(result.appType).to.equal('single');
      expect(result.isTestKey).to.equal(true);
    });

    it('should decode multi appType', () => {
      const result = decodeLicenseVersion3(
        'O=123,E=1514761200000,S=pro,LM=annual,PV=Q3-2024,Q=3,AT=multi,KV=3',
      );

      expect(result.appType).to.equal('multi');
      expect(result.quantity).to.equal(3);
    });
  });

  describe('decodeLicense', () => {
    it('should decode a v1 license key', () => {
      const encoded = TEST_KEY_V1.slice(32);
      const result = decodeLicense(encoded);

      expect(result).to.not.equal(null);
      expect(result!.keyVersion).to.equal(1);
      expect(result!.licenseModel).to.equal('perpetual');
      expect(result!.planScope).to.equal('pro');
      expect(result!.appType).to.equal('multi');
    });

    it('should decode a v2 license key', () => {
      const encoded = TEST_KEY_PRO_SUBSCRIPTION.slice(32);
      const result = decodeLicense(encoded);

      expect(result).to.not.equal(null);
      expect(result!.keyVersion).to.equal(2);
      expect(result!.planScope).to.equal('pro');
      expect(result!.licenseModel).to.equal('subscription');
      expect(result!.planVersion).to.equal('initial');
      expect(result!.appType).to.equal('multi');
    });

    it('should decode a v3 license key', () => {
      const encoded = TEST_KEY_PRO_ANNUAL_V3.slice(32);
      const result = decodeLicense(encoded);

      expect(result).to.not.equal(null);
      expect(result!.keyVersion).to.equal(3);
      expect(result!.planScope).to.equal('pro');
      expect(result!.licenseModel).to.equal('annual');
      expect(result!.planVersion).to.equal('Q3-2024');
      expect(result!.quantity).to.equal(5);
      expect(result!.appType).to.equal('single');
    });

    it('should return null for an unknown key version', () => {
      const encoded = TEST_KEY_UNKNOWN_VERSION.slice(32);
      const result = decodeLicense(encoded);

      expect(result).to.equal(null);
    });
  });
});
