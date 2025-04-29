import * as React from 'react';
import InstallationInstructions from './InstallationInstructions';

// #default-branch-switch

const packages = {
  Community: '@mui/x-charts',
  Pro: '@mui/x-charts-pro',
};

export default function DataGridInstallationInstructions() {
  return <InstallationInstructions packages={packages} />;
}
