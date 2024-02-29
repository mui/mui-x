import * as React from 'react';
import { MuiLicenseInfo } from '../utils/licenseInfo';

const MuiLicenseInfoContext = React.createContext<MuiLicenseInfo>({ key: undefined });

if (process.env.NODE_ENV !== 'production') {
  MuiLicenseInfoContext.displayName = 'MuiLicenseInfoContext';
}

export default MuiLicenseInfoContext;
