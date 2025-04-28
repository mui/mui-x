import * as React from 'react';
import InstallationInstructions from './InstallationInstructions';

// #npm-tag-reference

const packages = {
  Community: '@mui/x-data-grid@latest',
  Pro: '@mui/x-data-grid-pro@latest',
  Premium: '@mui/x-data-grid-premium@latest',
};

export default function DataGridInstallationInstructions() {
  return <InstallationInstructions packages={packages} />;
}
