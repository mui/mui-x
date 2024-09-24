import childProcess from 'child_process';

const pnpmUpdate = childProcess.spawnSync(
  'pnpm',
  ['update', '-r', '@mui/material@6.x', '@mui/system@6.x', '@mui/icons-material@6.x'],
  {
    shell: true,
    stdio: ['inherit', 'inherit', 'inherit'],
  },
);

process.exit(pnpmUpdate.status);
