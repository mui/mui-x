import * as React from 'react';
import InstallationInstructions from './InstallationInstructions';

// #npm-tag-reference

const packages = {
  Community: '@mui/x-tree-view@latest',
  Pro: '@mui/x-tree-view-pro@latest',
};

export default function TreeViewInstallationInstructions() {
  return <InstallationInstructions packages={packages} />;
}
