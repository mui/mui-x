import InstallationInstructions from './InstallationInstructions';

// #npm-tag-reference

const packages = {
  Community: '@mui/x-date-pickers@^8.0.0',
  Pro: '@mui/x-date-pickers-pro@^8.0.0',
};

const peerDependency = {
  label: 'Date library',
  packages: ['dayjs', 'date-fns', 'luxon', 'moment'],
};

export default function PickersInstallationInstructions() {
  return <InstallationInstructions packages={packages} peerDependency={peerDependency} />;
}
