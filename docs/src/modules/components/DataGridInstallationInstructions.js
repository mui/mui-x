import InstallationInstructions from './InstallationInstructions';

// #npm-tag-reference
// Use "@next" tag for the master git branch after we start working on the next major version
// Once the major release is finished we can remove the "@next" tag
// For the version branches (e.g., v8.x, v7.x) we should use the version "@^8.0.0" for v8.x, "@^7.0.0" for v7.x, etc.

const packages = {
  Community: '@mui/x-data-grid@next',
  Pro: '@mui/x-data-grid-pro@next',
  Premium: '@mui/x-data-grid-premium@next',
};

export default function DataGridInstallationInstructions() {
  return <InstallationInstructions packages={packages} />;
}
