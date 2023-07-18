import * as React from 'react';
import LicenseInfoContext from './LicenseInfoContext';
import { MuiLicenseInfo } from '../utils/licenseInfo';

export interface LicenseInfoProviderProps {
  info: MuiLicenseInfo;
  children?: React.ReactNode;
}

export function LicenseInfoProvider({ info, children }: LicenseInfoProviderProps) {
  return <LicenseInfoContext.Provider value={info}>{children}</LicenseInfoContext.Provider>;
}
