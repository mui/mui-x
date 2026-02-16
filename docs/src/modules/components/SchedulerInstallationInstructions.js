import InstallationInstructions from './InstallationInstructions';

const packages = {
  Community: '@mui/x-scheduler',
  Premium: '@mui/x-scheduler-premium',
};

export default function SchedulerInstallationInstructions() {
  return <InstallationInstructions packages={packages} />;
}
