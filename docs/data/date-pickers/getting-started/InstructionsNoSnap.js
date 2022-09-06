import * as React from 'react';
import HighlightedCode from 'docs/src/modules/components/HighlightedCode';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';

const libraries = ['date-fns', 'dayjs', 'luxon', 'moment'];

const InstructionsNoSnap = () => {
  const [licenceType, setLicenceType] = React.useState('community');
  const [packageManger, setPackageManger] = React.useState('yarn');
  const [libraryUsed, setLibraryUsed] = React.useState('moment');

  const handlePackageMangerChange = (event, nextPackageManger) => {
    setPackageManger(nextPackageManger);
  };

  const handleLicenceTypeChange = (event, nextLicenceType) => {
    setLicenceType(nextLicenceType);
  };

  const handleLibraryUsedChange = (event) => {
    setLibraryUsed(event.target.value);
  };

  const installationCLI = packageManger === 'npm' ? 'npm install ' : 'yarn add ';
  const componentPackage =
    licenceType === 'pro' ? '@mui/x-date-pickers-pro' : '@mui/x-date-pickers';

  const commandLines = [
    `// Install component (${licenceType} version)`,
    `${installationCLI}${componentPackage}`,
    `// Install date library (if not already installed)`,
    `${installationCLI}${libraryUsed}`,
  ].join('\n');

  return (
    <Stack sx={{ width: '100%' }} px={{ xs: 3, sm: 0 }}>
      <Stack direction="row" spacing={2}>
        <ToggleButtonGroup
          // orientation="vertical"
          value={packageManger}
          exclusive
          onChange={handlePackageMangerChange}
          size="small"
        >
          <ToggleButton value="yarn">yarn</ToggleButton>
          <ToggleButton value="npm">npm</ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup
          // orientation="vertical"
          value={licenceType}
          exclusive
          onChange={handleLicenceTypeChange}
          size="small"
        >
          <ToggleButton value="community">community</ToggleButton>
          <ToggleButton value="pro">pro</ToggleButton>
        </ToggleButtonGroup>
        <TextField
          size="small"
          label="date-library"
          value={libraryUsed}
          onChange={handleLibraryUsedChange}
          select
        >
          {libraries.map((lib) => (
            <MenuItem value={lib}>{lib}</MenuItem>
          ))}
        </TextField>
      </Stack>
      <HighlightedCode sx={{ width: '100%' }} code={commandLines} language="tsx" />
    </Stack>
  );
};

export default InstructionsNoSnap;
