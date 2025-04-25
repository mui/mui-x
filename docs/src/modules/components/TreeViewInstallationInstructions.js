import * as React from 'react';
import InstallationInstructions from './InstallationInstructions';

// #default-branch-switch

const packages = {
  Community: '@mui/x-tree-view@^7.0.0',
  Pro: '@mui/x-tree-view-pro@^7.0.0',
};

export default function TreeViewInstallationInstructions() {
  return <InstallationInstructions packages={packages} />;
}
