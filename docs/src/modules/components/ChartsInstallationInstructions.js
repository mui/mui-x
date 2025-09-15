import * as React from 'react';
import InstallationInstructions from './InstallationInstructions';

// #default-branch-switch

const packages = {
  Community: '@mui/x-charts@^7.0.0',
  Pro: '@mui/x-charts-pro@^7.0.0',
};

export default function DataGridInstallationInstructions() {
  return <InstallationInstructions packages={packages} />;
}
