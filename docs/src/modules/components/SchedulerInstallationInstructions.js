import InstallationInstructions from './InstallationInstructions';

const packages = {
  Community: '@mui/x-scheduler',
};

export default function SchedulerInstallationInstructions() {
  return <InstallationInstructions packages={packages} />;
}
