import * as React from 'react';
import { HighlightedCode } from '@mui/internal-core-docs/HighlightedCode';
import Stack from '@mui/material/Stack';
import ToggleOptions from './ToggleOptions';

const packages: Record<string, string> = {
  Community: '@mui/x-scheduler',
  Premium: '@mui/x-scheduler-premium',
};

export default function SchedulerPlanCode(props: {
  getCode: (licenceType: string, componentPackage: string) => string;
}) {
  const { getCode } = props;
  const [licenceType, setLicenceType] = React.useState('Community');

  return (
    <Stack sx={{ px: { xs: 3, sm: 0 }, width: '100%' }}>
      <ToggleOptions
        value={licenceType}
        setValue={setLicenceType}
        options={Object.keys(packages)}
        label="Plan"
      />
      <HighlightedCode
        sx={{ width: '100%' }}
        code={getCode(licenceType, packages[licenceType])}
        language="tsx"
      />
    </Stack>
  );
}
