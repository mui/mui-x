import * as React from 'react';
import InstallationInstructions from './InstallationInstructions';

// #default-branch-switch

const packages = {
  Community: '@mui/x-charts@next',
  Pro: '@mui/x-charts-pro@next',
};

export default function DataGridInstallationInstructions() {
  return <InstallationInstructions packages={packages} />;
}
