import * as React from 'react';
import InstallationInstructions from './InstallationInstructions';

// #npm-tag-reference

const packages = {
  Community: '@mui/x-tree-view',
  Pro: '@mui/x-tree-view-pro',
};

export default function TreeViewInstallationInstructions() {
  return <InstallationInstructions packages={packages} />;
}
