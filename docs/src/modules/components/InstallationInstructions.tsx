import * as React from 'react';
// @ts-expect-error
import HighlightedCode from 'docs/src/modules/components/HighlightedCode';
import Stack from '@mui/material/Stack';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

const defaultPackageManagers = {
  yarn: 'yarn add',
  npm: 'npm install',
};

export default function InstallationInstructions(props: {
  packages: Record<string, string>;
  peerDependency?: {
    label: string;
    packages: string[];
    installationComment?: string;
  };
  packageManagers: Record<string, string>;
}) {
  const { packages, packageManagers = defaultPackageManagers, peerDependency = null } = props;
  const packagesTypes = Object.keys(packages);
  const packageManagersNames = Object.keys(packageManagers);

  const [licenseType, setLicenseType] = React.useState(packagesTypes[0]);
  const [packageManger, setPackageManger] = React.useState(packageManagersNames[0]);
  const [libraryUsed, setLibraryUsed] = React.useState(
    peerDependency ? peerDependency.packages[0] : null,
  );

  const handlePackageMangerChange = (
    event: React.MouseEvent<HTMLElement>,
    nextPackageManager: string,
  ) => {
    if (nextPackageManager !== null) {
      setPackageManger(nextPackageManager);
    }
  };

  const handleLicenseTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    nextLicenseType: string,
  ) => {
    if (nextLicenseType !== null) {
      setLicenseType(nextLicenseType);
    }
  };

  const commands = [`${packageManagers[packageManger]} ${packages[licenseType]}`];

  if (peerDependency) {
    commands.push('');
    if (peerDependency.installationComment) {
      commands.push(peerDependency.installationComment);
    }
    commands.push(`${packageManagers[packageManger]} ${libraryUsed}`);
  }

  return (
    <Stack sx={{ width: '100%' }} px={{ xs: 3, sm: 0 }}>
      <Stack direction="row" spacing={2}>
        <ToggleButtonGroup
          value={packageManger}
          exclusive
          onChange={handlePackageMangerChange}
          size="small"
        >
          {packageManagersNames.map((key) => (
            <ToggleButton value={key} key={key}>
              {key}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <ToggleButtonGroup
          value={licenseType}
          exclusive
          onChange={handleLicenseTypeChange}
          size="small"
        >
          {packagesTypes.map((key) => (
            <ToggleButton value={key} key={key}>
              {key}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        {peerDependency ? (
          <TextField
            size="small"
            label={peerDependency.label}
            value={libraryUsed}
            onChange={(event) => {
              setLibraryUsed(event.target.value);
            }}
            select
          >
            {peerDependency.packages.map((packageName) => (
              <MenuItem key={packageName} value={packageName}>
                {packageName}
              </MenuItem>
            ))}
          </TextField>
        ) : null}
      </Stack>
      <HighlightedCode sx={{ width: '100%' }} code={commands.join('\n')} language="sh" />
    </Stack>
  );
}
