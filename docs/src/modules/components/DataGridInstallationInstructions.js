import InstallationInstructions from './InstallationInstructions';

// #npm-tag-reference

const packages = {
  Community: '@mui/x-data-grid@^8.0.0',
  Pro: '@mui/x-data-grid-pro@^8.0.0',
  Premium: '@mui/x-data-grid-premium@^8.0.0',
};

export default function DataGridInstallationInstructions() {
  return <InstallationInstructions packages={packages} />;
}
