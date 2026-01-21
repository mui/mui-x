import InstallationInstructions from './InstallationInstructions';

// #npm-tag-reference
// Use "@next" tag for the master git branch after we start working on the next major version
// Once the major release is finished we can remove the "@next" tag
// For the version branches (e.g., v8.x, v7.x) we should use the version "@^8.0.0" for v8.x, "@^7.0.0" for v7.x, etc.

const packages = {
  Community: '@mui/x-date-pickers@next',
  Pro: '@mui/x-date-pickers-pro@next',
};

const peerDependency = {
  label: 'Date library',
  packages: ['dayjs', 'date-fns', 'luxon', 'moment'],
};

export default function PickersInstallationInstructions() {
  return <InstallationInstructions packages={packages} peerDependency={peerDependency} />;
}
