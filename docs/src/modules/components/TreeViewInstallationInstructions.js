import InstallationInstructions from './InstallationInstructions';

// #npm-tag-reference

const packages = {
  Community: '@mui/x-tree-view@^8.0.0',
  Pro: '@mui/x-tree-view-pro@^8.0.0',
};

export default function TreeViewInstallationInstructions() {
  return <InstallationInstructions packages={packages} />;
}
