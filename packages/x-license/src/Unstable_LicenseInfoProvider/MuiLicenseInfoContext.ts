'use client';
import * as React from 'react';
import { MuiLicenseInfo } from '../utils/licenseInfo';

const MuiLicenseInfoContext = React.createContext<MuiLicenseInfo>({ key: undefined });

export default MuiLicenseInfoContext;
