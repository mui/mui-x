import InstallationInstructions from './InstallationInstructions';

// #npm-tag-reference

const packages = {
  Community: '@mui/x-charts@^8.0.0',
  Pro: '@mui/x-charts-pro@^8.0.0',
  Premium: '@mui/x-charts-premium@^8.0.0',
};

export default function DataGridInstallationInstructions() {
  return <InstallationInstructions packages={packages} />;
}
