import childProcess from 'child_process';

const pnpmUpdate = childProcess.spawnSync(
  'pnpm',
  [
    'update',
    '-r',
    '@mui/material@next',
    '@mui/system@next',
    '@mui/icons-material@next',
    '@mui/utils@next',
    '@mui/material-nextjs@next',
    '@mui/styles@next',
    '@mui/lab@next',
  ],
  {
    shell: true,
    stdio: ['inherit', 'inherit', 'inherit'],
  },
);

process.exit(pnpmUpdate.status);
