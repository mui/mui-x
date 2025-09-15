import * as React from 'react';
import InstallationInstructions from './InstallationInstructions';

// #default-branch-switch

const packages = {
  Community: '@mui/x-data-grid@^7.0.0',
  Pro: '@mui/x-data-grid-pro@^7.0.0',
  Premium: '@mui/x-data-grid-premium@^7.0.0',
};

export default function DataGridInstallationInstructions() {
  return <InstallationInstructions packages={packages} />;
}
