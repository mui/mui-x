import * as React from 'react';
import InstallationInstructions from './InstallationInstructions';

// #default-branch-switch

const packages = {
  Community: '@mui/x-tree-view@next',
  Pro: '@mui/x-tree-view-pro@next',
};

export default function TreeViewInstallationInstructions() {
  return <InstallationInstructions packages={packages} />;
}
