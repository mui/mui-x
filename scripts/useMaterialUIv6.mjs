import childProcess from 'child_process';

childProcess.spawnSync('git', ['apply', 'scripts/material-ui-v6.patch'], {
  shell: true,
  stdio: ['inherit', 'inherit', 'inherit'],
});

childProcess.spawnSync('pnpm', ['install'], {
  shell: true,
  stdio: ['inherit', 'inherit', 'inherit'],
});
