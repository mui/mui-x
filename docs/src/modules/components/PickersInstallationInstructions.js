import * as React from 'react';
import InstallationInstructions from './InstallationInstructions';

// #npm-tag-reference

const packages = {
  Community: '@mui/x-date-pickers@latest',
  Pro: '@mui/x-date-pickers-pro@latest',
};

const peerDependency = {
  label: 'Date library',
  packages: ['dayjs', 'date-fns', 'luxon', 'moment'],
};

export default function PickersInstallationInstructions() {
  return <InstallationInstructions packages={packages} peerDependency={peerDependency} />;
}
