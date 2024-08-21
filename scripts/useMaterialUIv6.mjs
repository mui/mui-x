import childProcess from 'child_process';

const gitApply = childProcess.spawnSync('git', ['apply', 'scripts/material-ui-v6.patch'], {
  shell: true,
  stdio: ['inherit', 'inherit', 'inherit'],
});
if (gitApply.status !== 0) {
  process.exit(gitApply.status);
}

const pnpmInstall = childProcess.spawnSync('pnpm', ['install'], {
  shell: true,
  stdio: ['inherit', 'inherit', 'inherit'],
});
process.exit(pnpmInstall.status);
