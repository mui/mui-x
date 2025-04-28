import * as React from 'react';
import InstallationInstructions from './InstallationInstructions';

// #npm-tag-reference

const packages = {
  Community: '@mui/x-charts@latest',
  Pro: '@mui/x-charts-pro@latest',
};

export default function DataGridInstallationInstructions() {
  return <InstallationInstructions packages={packages} />;
}
