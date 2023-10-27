import * as React from 'react';
import LicenseInfoContext from './LicenseInfoContext';
import { MuiLicenseInfo } from '../utils/licenseInfo';

/**
 * @ignore - do not document.
 */
export interface LicenseInfoProviderProps {
  info: MuiLicenseInfo;
  children?: React.ReactNode;
}

/**
 * @ignore - do not document.
 */
export function LicenseInfoProvider({ info, children }: LicenseInfoProviderProps) {
  return <LicenseInfoContext.Provider value={info}>{children}</LicenseInfoContext.Provider>;
}
