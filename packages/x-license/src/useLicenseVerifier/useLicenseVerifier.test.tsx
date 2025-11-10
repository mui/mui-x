import * as React from 'react';
import { createRenderer, ErrorBoundary, reactMajor, screen } from '@mui/internal-test-utils';
import {
  useLicenseVerifier,
  LicenseInfo,
  generateLicense,
  Unstable_LicenseInfoProvider as LicenseInfoProvider,
  MuiCommercialPackageName,
} from '@mui/x-license';
import { isJSDOM } from 'test/utils/skipIf';
import { clearLicenseStatusCache } from './useLicenseVerifier';
import { generateReleaseInfo } from '../verifyLicense';

const oneDayInMS = 1000 * 60 * 60 * 24;
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
      const key = generateLicense({
        expiryDate: new Date(3001, 0, 0, 0, 0, 0, 0),
        licenseModel: 'perpetual',
        orderNumber: '123',
        planScope: 'pro',
        planVersion: 'initial',
      });

      LicenseInfo.setLicenseKey('');

      expect(() => {
        render(
          <LicenseInfoProvider info={{ key }}>
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

      const expiredLicenseKey = generateLicense({
        expiryDate: new Date(new Date().getTime() - oneDayInMS * 30),
        orderNumber: '123',
        planScope: 'pro',
        licenseModel: 'subscription',
        planVersion: 'initial',
      });
      LicenseInfo.setLicenseKey(expiredLicenseKey);

      const errorRef = React.createRef<any>();

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
      expect((errorRef.current as any).errors[0].toString()).to.match(/MUI X: Expired license key/);
    });

    const planCombinations = [
      {
        planVersion: 'initial',
        planScope: 'pro',
        ok: ['x-data-grid-pro', 'x-date-pickers-pro'],
        notOk: ['x-charts-premium', 'x-data-grid-premium'],
        notInInitial: ['x-charts-pro', 'x-tree-view-pro'],
      },
      {
        planVersion: 'initial',
        planScope: 'premium',
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
        ok: ['x-data-grid-pro', 'x-date-pickers-pro', 'x-charts-pro', 'x-tree-view-pro'],
        notOk: ['x-charts-premium', 'x-data-grid-premium'],
        notInInitial: [],
      },
      {
        planVersion: 'Q3-2024',
        planScope: 'premium',
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
      ({ planVersion, planScope, ok, notOk, notInInitial }) => {
        // Avoid Karma "Invalid left-hand side in assignment" SyntaxError
        // eslint-disable-next-line no-useless-concat
        process.env['NODE_' + 'ENV'] = 'development';

        const licenseKey = generateLicense({
          expiryDate: new Date(3001, 0, 0, 0, 0, 0, 0),
          orderNumber: '123',
          planScope,
          licenseModel: 'subscription',
          planVersion,
        });

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
