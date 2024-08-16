import * as React from 'react';
import { HighlightedCode } from '@mui/docs/HighlightedCode';
import Stack from '@mui/material/Stack';
import ToggleOptions from './ToggleOptions';

const libraries = {
  dayjs: 'AdapterDayjs',
  'date-fns': 'AdapterDateFns',
  luxon: 'AdapterLuxon',
  moment: 'AdapterMoment',
};

export default function PickersRenderingInstructions() {
  const [licenceType, setLicenceType] = React.useState('community');
  const [libraryUsed, setLibraryUsed] = React.useState('dayjs');

  const componentPackage =
    licenceType === 'pro' ? '@mui/x-date-pickers-pro' : '@mui/x-date-pickers';

  const adapterName = libraries[libraryUsed];

  const commandLines = [
    `import { LocalizationProvider } from '${componentPackage}';`,
    ...(libraryUsed === 'date-fns'
      ? ['// If you are using date-fns v2.x, please import `AdapterDateFns`']
      : []),
    `import { ${adapterName} } from '${componentPackage}/${adapterName}'`,
    ...(libraryUsed === 'date-fns'
      ? [
          '// If you are using date-fns v3.x, please import the v3 adapter',
          `import { ${adapterName} } from '${componentPackage}/AdapterDateFnsV3'`,
        ]
      : []),
    '',
    'function App({ children }) {',
    '  return (',
    `    <LocalizationProvider dateAdapter={${adapterName}}>`,
    '      {children}',
    '    </LocalizationProvider>',
    '  );',
    '}',
  ].join('\n');

  return (
    <Stack sx={{ width: '100%' }} px={{ xs: 3, sm: 0 }}>
      <Stack direction="row" spacing={2}>
        <ToggleOptions
          value={licenceType}
          setValue={setLicenceType}
          options={['community', 'pro']}
          label="Plan"
        />

        <ToggleOptions
          value={libraryUsed}
          setValue={setLibraryUsed}
          options={Object.keys(libraries)}
          label="Date library"
          autoColapse
        />
      </Stack>
      <HighlightedCode sx={{ width: '100%' }} code={commandLines} language="tsx" />
    </Stack>
  );
}
