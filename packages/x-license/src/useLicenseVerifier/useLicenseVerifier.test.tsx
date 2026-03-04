import * as React from 'react';
import { vi } from 'vitest';
import { createRenderer, ErrorBoundary, reactMajor, screen } from '@mui/internal-test-utils';
import { LicenseInfo, Unstable_LicenseInfoProvider as LicenseInfoProvider } from '@mui/x-license';
import { isJSDOM } from 'test/utils/skipIf';
import type { MuiCommercialPackageName } from '../utils/commercialPackages';
import { useLicenseVerifier, clearLicenseStatusCache } from './useLicenseVerifier';
// eslint-disable-next-line import/extensions
import generateReleaseInfo from '../../../../scripts/generateReleaseInfo.mjs';
import {
  TEST_LICENSE_KEY_PRO,
  TEST_LICENSE_KEY_PREMIUM,
  TEST_KEY_EXPIRED_30DAYS,
  TEST_KEY_PRO_SUBSCRIPTION_FUTURE,
  TEST_KEY_PREMIUM_SUBSCRIPTION_FUTURE,
  TEST_KEY_PRO_ANNUAL_Q1_2026_V3,
  TEST_KEY_PREMIUM_ANNUAL_Q1_2026_V3,
} from '../test-keys';

const releaseDate = new Date(3000, 0, 0, 0, 0, 0, 0);
const RELEASE_INFO = generateReleaseInfo(releaseDate);

function TestComponent(props: { packageName?: MuiCommercialPackageName }) {
  const licenseStatus = useLicenseVerifier(props.packageName || 'x-date-pickers-pro', RELEASE_INFO);
  return <div data-testid="status">Status: {licenseStatus.status}</div>;
}

// Can't change the process.env.NODE_ENV in Browser
describe.skipIf(!isJSDOM)('useLicenseVerifier', () => {
  const { render } = createRenderer();

  let env: any;

  beforeEach(() => {
    env = process.env.NODE_ENV;
    // Avoid Karma "Invalid left-hand side in assignment" SyntaxError
    // eslint-disable-next-line no-useless-concat
    process.env['NODE_' + 'ENV'] = 'test';
  });

  afterEach(() => {
    // Avoid Karma "Invalid left-hand side in assignment" SyntaxError
    // eslint-disable-next-line no-useless-concat
    process.env['NODE_' + 'ENV'] = env;
  });

  describe('error', () => {
    beforeEach(() => {
      clearLicenseStatusCache();
    });

    it('should log the missing license key error only once', () => {
      LicenseInfo.setLicenseKey('');
      expect(() => {
        render(<TestComponent />);
      }).toErrorDev(['MUI X: Missing license key']);
    });

    it('should detect an override of a valid license key in the context', () => {
      LicenseInfo.setLicenseKey('');

      expect(() => {
        render(
          <LicenseInfoProvider info={{ key: TEST_LICENSE_KEY_PRO }}>
            <TestComponent />
          </LicenseInfoProvider>,
        );
      }).not.toErrorDev();

      expect(screen.getByTestId('status')).to.have.text('Status: Valid');
    });

    it('should throw if the license is expired by more than a 30 days', () => {
      // Avoid Karma "Invalid left-hand side in assignment" SyntaxError
      // eslint-disable-next-line no-useless-concat
      process.env['NODE_' + 'ENV'] = 'development';

      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-06-15T00:00:00.000Z'));

      LicenseInfo.setLicenseKey(TEST_KEY_EXPIRED_30DAYS);

      const errorRef = React.createRef<any>();

      try {
        expect(() => {
          render(
            <ErrorBoundary ref={errorRef}>
              <TestComponent />
            </ErrorBoundary>,
          );
        }).to.toErrorDev([
          reactMajor >= 19 && 'MUI X: Expired license key',
          reactMajor < 19 && 'The above error occurred in the <TestComponent> component',
        ]);
        expect((errorRef.current as any).errors[0].toString()).to.match(
          /MUI X: Expired license key/,
        );
      } finally {
        vi.useRealTimers();
      }
    });

    const planCombinations = [
      {
        planVersion: 'initial',
        planScope: 'pro',
        licenseKey: TEST_KEY_PRO_SUBSCRIPTION_FUTURE,
        ok: ['x-data-grid-pro', 'x-date-pickers-pro'],
        notOk: ['x-charts-premium', 'x-data-grid-premium'],
        notInInitial: ['x-charts-pro', 'x-tree-view-pro'],
      },
      {
        planVersion: 'initial',
        planScope: 'premium',
        licenseKey: TEST_KEY_PREMIUM_SUBSCRIPTION_FUTURE,
        ok: [
          'x-data-grid-pro',
          'x-data-grid-premium',
          'x-date-pickers-pro',
          'x-charts-pro',
          'x-charts-premium',
          'x-tree-view-pro',
        ],
        notOk: [],
        notInInitial: [],
      },
      {
        planVersion: 'Q3-2024',
        planScope: 'pro',
        licenseKey: TEST_LICENSE_KEY_PRO,
        ok: ['x-data-grid-pro', 'x-date-pickers-pro', 'x-charts-pro', 'x-tree-view-pro'],
        notOk: ['x-charts-premium', 'x-data-grid-premium'],
        notInInitial: [],
      },
      {
        planVersion: 'Q3-2024',
        planScope: 'premium',
        licenseKey: TEST_LICENSE_KEY_PREMIUM,
        ok: [
          'x-data-grid-pro',
          'x-data-grid-premium',
          'x-date-pickers-pro',
          'x-charts-pro',
          'x-charts-premium',
          'x-tree-view-pro',
        ],
        notOk: [],
        notInInitial: [],
      },
      {
        planVersion: 'Q1-2026',
        planScope: 'pro',
        licenseKey: TEST_KEY_PRO_ANNUAL_Q1_2026_V3,
        ok: ['x-data-grid-pro', 'x-date-pickers-pro', 'x-charts-pro', 'x-tree-view-pro'],
        notOk: ['x-charts-premium', 'x-data-grid-premium'],
        notInInitial: [],
      },
      {
        planVersion: 'Q1-2026',
        planScope: 'premium',
        licenseKey: TEST_KEY_PREMIUM_ANNUAL_Q1_2026_V3,
        ok: [
          'x-data-grid-pro',
          'x-data-grid-premium',
          'x-date-pickers-pro',
          'x-charts-pro',
          'x-charts-premium',
          'x-tree-view-pro',
        ],
        notOk: [],
        notInInitial: [],
      },
    ] as const;

    it.each(planCombinations)(
      'should work for plan $planVersion with scope $planScope',
      ({ licenseKey, ok, notOk, notInInitial }) => {
        // Avoid Karma "Invalid left-hand side in assignment" SyntaxError
        // eslint-disable-next-line no-useless-concat
        process.env['NODE_' + 'ENV'] = 'development';

        LicenseInfo.setLicenseKey(licenseKey);

        ok.forEach((packageName) => {
          expect(() => {
            render(<TestComponent packageName={packageName} />);
          }, packageName).not.toErrorDev();
        });

        notOk.forEach((packageName) => {
          expect(() => {
            render(<TestComponent packageName={packageName} />);
          }, packageName).to.toErrorDev(['MUI X: License key plan mismatch.']);
        });

        notInInitial.forEach((packageName) => {
          expect(() => {
            render(<TestComponent packageName={packageName} />);
          }, packageName).to.toErrorDev(['MUI X: Component not included in your license.']);
        });
      },
    );
  });
});
