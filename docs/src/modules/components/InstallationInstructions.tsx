import * as React from 'react';
import HighlightedCodeWithTabs from '@mui/docs/HighlightedCodeWithTabs';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import ToggleOptions from './ToggleOptions';

const defaultPackageManagers: Record<string, string> = {
  npm: 'npm install',
  pnpm: 'pnpm add',
  yarn: 'yarn add',
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

  const [licenceType, setLicenceType] = React.useState(packagesTypes[0]);
  const [libraryUsed, setLibraryUsed] = React.useState(
    peerDependency ? peerDependency.packages[0] : '',
  );

  const tabs = Object.entries(packageManagers).map(([packageManger, installInstruction]) => {
    const code = [`${installInstruction} ${packages[licenceType]}`];

    if (peerDependency) {
      code.push('');
      if (peerDependency.installationComment) {
        code.push(peerDependency.installationComment);
      }
      code.push(`${installInstruction} ${libraryUsed}`);
    }
    return {
      code: code.join('\n'),
      language: 'bash',
      tab: packageManger,
    };
  });

  return (
    <Stack sx={{ width: '100%' }} px={{ xs: 3, sm: 0 }}>
      <Box sx={{ display: 'flex', gap: 3, width: 'max-content', py: 1, pb: 1.5 }}>
        <ToggleOptions
          value={licenceType}
          setValue={setLicenceType}
          options={packagesTypes}
          label="Plan"
        />
        {peerDependency && (
          <ToggleOptions
            label="Date Library"
            value={libraryUsed!}
            setValue={setLibraryUsed}
            options={peerDependency.packages}
            autoColapse
          />
        )}
      </Box>

      <HighlightedCodeWithTabs tabs={tabs} storageKey="codeblock-package-manager" />
    </Stack>
  );
}
