import childProcess from 'child_process';

const pnpmUpdate = childProcess.spawnSync(
  'pnpm',
  ['update', '-r', '@mui/material@next', '@mui/system@next', '@mui/icons-material@next'],
  {
    shell: true,
    stdio: ['inherit', 'inherit', 'inherit'],
  },
);

process.exit(pnpmUpdate.status);
