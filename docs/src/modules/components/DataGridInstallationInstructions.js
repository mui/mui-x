import * as React from 'react';
import InstallationInstructions from './InstallationInstructions';

const packages = {
  Community: '@mui/x-data-grid@next',
  Pro: '@mui/x-data-grid-pro@next',
  Premium: '@mui/x-data-grid-premium@next',
};

export default function DataGridInstallationInstructions() {
  return <InstallationInstructions packages={packages} />;
}
