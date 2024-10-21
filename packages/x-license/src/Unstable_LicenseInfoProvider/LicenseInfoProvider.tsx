import * as React from 'react';
import MuiLicenseInfoContext from './MuiLicenseInfoContext';
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
  return <MuiLicenseInfoContext.Provider value={info}>{children}</MuiLicenseInfoContext.Provider>;
}
