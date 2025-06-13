import * as React from 'react';
import InstallationInstructions from './InstallationInstructions';

// #npm-tag-reference

const packages = {
  Community: '@mui/x-charts',
  Pro: '@mui/x-charts-pro',
  // TODO: CHARTS-PREMIUM: Uncomment when the package is available
  // Premium: '@mui/x-charts-premium',
};

export default function DataGridInstallationInstructions() {
  return <InstallationInstructions packages={packages} />;
}
