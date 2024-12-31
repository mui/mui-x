import * as React from 'react';
import { expect } from 'chai';
import { createRenderer, ErrorBoundary, reactMajor, screen } from '@mui/internal-test-utils';
import {
  useLicenseVerifier,
  LicenseInfo,
  generateLicense,
  Unstable_LicenseInfoProvider as LicenseInfoProvider,
  MuiCommercialPackageName,
} from '@mui/x-license';
import { describeSkipIf, isJSDOM } from 'test/utils/skipIf';
import { sharedLicenseStatuses } from './useLicenseVerifier';
import { generateReleaseInfo } from '../verifyLicense';

const oneDayInMS = 1000 * 60 * 60 * 24;
const releaseDate = new Date(3000, 0, 0, 0, 0, 0, 0);
const RELEASE_INFO = generateReleaseInfo(releaseDate);

function TestComponent(props: { packageName?: MuiCommercialPackageName }) {
  const licenseStatus = useLicenseVerifier(props.packageName || 'x-date-pickers-pro', RELEASE_INFO);
  return <div data-testid="status">Status: {licenseStatus.status}</div>;
}

// Can't change the process.env.NODE_ENV in Karma
describeSkipIf(!isJSDOM)('useLicenseVerifier', function test() {
  const { render } = createRenderer();

  let env: any;

  // eslint-disable-next-line mocha/no-top-level-hooks
  beforeEach(() => {
    env = process.env.NODE_ENV;
    // Avoid Karma "Invalid left-hand side in assignment" SyntaxError
    // eslint-disable-next-line no-useless-concat
    process.env['NODE_' + 'ENV'] = 'test';
  });

  // eslint-disable-next-line mocha/no-top-level-hooks
  afterEach(() => {
    // Avoid Karma "Invalid left-hand side in assignment" SyntaxError
    // eslint-disable-next-line no-useless-concat
    process.env['NODE_' + 'ENV'] = env;
  });

  describe('error', () => {
    beforeEach(() => {
      Object.keys(sharedLicenseStatuses).forEach((key) => {
        // @ts-ignore
        delete sharedLicenseStatuses[key];
      });
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
        orderNumber: '12345',
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
        orderNumber: 'MUI-123',
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
        'MUI X: Expired license key',
        reactMajor < 19 && 'MUI X: Expired license key',
        reactMajor < 19 && 'The above error occurred in the <TestComponent> component',
      ]);
      expect((errorRef.current as any).errors[0].toString()).to.match(/MUI X: Expired license key/);
    });

    it('should throw if the license is not covering charts and tree-view', () => {
      // Avoid Karma "Invalid left-hand side in assignment" SyntaxError
      // eslint-disable-next-line no-useless-concat
      process.env['NODE_' + 'ENV'] = 'development';

      const licenseKey = generateLicense({
        expiryDate: new Date(3001, 0, 0, 0, 0, 0, 0),
        orderNumber: 'MUI-123',
        planScope: 'pro',
        licenseModel: 'subscription',
        planVersion: 'initial',
      });

      LicenseInfo.setLicenseKey(licenseKey);

      expect(() => {
        render(<TestComponent packageName={'x-charts-pro'} />);
      }).to.toErrorDev(['MUI X: Component not included in your license.']);

      expect(() => {
        render(<TestComponent packageName={'x-tree-view-pro'} />);
      }).to.toErrorDev(['MUI X: Component not included in your license.']);
    });

    it('should not throw if the license is covering charts and tree-view', () => {
      // Avoid Karma "Invalid left-hand side in assignment" SyntaxError
      // eslint-disable-next-line no-useless-concat
      process.env['NODE_' + 'ENV'] = 'development';

      const licenseKey = generateLicense({
        expiryDate: new Date(3001, 0, 0, 0, 0, 0, 0),
        orderNumber: 'MUI-123',
        planScope: 'pro',
        licenseModel: 'subscription',
        planVersion: 'Q3-2024',
      });

      LicenseInfo.setLicenseKey(licenseKey);

      expect(() => {
        render(<TestComponent packageName={'x-charts-pro'} />);
      }).not.toErrorDev();

      expect(() => {
        render(<TestComponent packageName={'x-tree-view-pro'} />);
      }).not.toErrorDev();
    });

    it('should not throw for existing pro and premium packages', () => {
      // Avoid Karma "Invalid left-hand side in assignment" SyntaxError
      // eslint-disable-next-line no-useless-concat
      process.env['NODE_' + 'ENV'] = 'development';

      const licenseKey = generateLicense({
        expiryDate: new Date(3001, 0, 0, 0, 0, 0, 0),
        orderNumber: 'MUI-123',
        planScope: 'premium',
        licenseModel: 'subscription',
        planVersion: 'Q3-2024',
      });

      LicenseInfo.setLicenseKey(licenseKey);

      expect(() => {
        render(<TestComponent packageName={'x-data-grid-pro'} />);
      }).not.toErrorDev();

      expect(() => {
        render(<TestComponent packageName={'x-data-grid-premium'} />);
      }).not.toErrorDev();

      expect(() => {
        render(<TestComponent packageName={'x-date-pickers-pro'} />);
      }).not.toErrorDev();
    });
  });
});
