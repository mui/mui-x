import * as React from 'react';
import { expect } from 'chai';
import { createRenderer, screen } from '@mui/monorepo/test/utils';
import {
  useLicenseVerifier,
  LicenseInfo,
  generateLicense,
  Unstable_LicenseInfoProvider as LicenseInfoProvider,
} from '@mui/x-license-pro';
import { sharedLicenseStatuses } from './useLicenseVerifier';
import { generateReleaseInfo } from '../verifyLicense';

const releaseDate = new Date(3000, 0, 0, 0, 0, 0, 0);
const releaseInfo = generateReleaseInfo(releaseDate);

function TestComponent() {
  const licesenStatus = useLicenseVerifier('x-date-pickers-pro', releaseInfo);
  return <div data-testid="status">Status: {licesenStatus.status}</div>;
}

describe('useLicenseVerifier', () => {
  const { render } = createRenderer();

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
      }).toErrorDev(['MUI: Missing license key']);
    });

    it('should detect an override of a valid license key in the context', () => {
      const key = generateLicense({
        expiryDate: new Date(3001, 0, 0, 0, 0, 0, 0),
        licensingModel: 'perpetual',
        orderNumber: '12345',
        scope: 'pro',
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
  });
});
