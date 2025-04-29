import childProcess from 'child_process';
import fse from 'fs-extra';
import path from 'path';
import { promisify } from 'util';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { getWorkspaceRoot } from './utils.mjs';

/**
 * Only directly call it with side-effect free commands.
 * Otherwise use the `exec` that's considering whether the context is supposed to be "dry" i.e. have no side-effects.
 */
const execActual = promisify(childProcess.exec);
/**
 * @param {string} command
 * @param {unknown} [options]
 */
function execDry(command, options) {
  // eslint-disable-next-line no-console
  console.log(`exec(\`${command}\`, ${JSON.stringify(options)})`);
}

/**
 * Find the remote pointing to mui/mui-x.
 *
 * Conventionally this should be named `upstream` but some collaborators might've used a different naming scheme.
 * Returns an object { name, url, method }
 */
async function findMuiXRemote() {
  const { stdout } = await execActual(['git', 'remote', '-v'].join(' '));
  const remoteLines = stdout.trim().split(/\r?\n/);

  return remoteLines
    .map((remoteLine) => {
      const [name, url, method] = remoteLine.split(/\s/);
      return { name, url, method };
    })
    .find((remote) => {
      // To test the regexp, go to: https://regex101.com/r/fBVJUX/1
      // matching:
      // - https://github.com/mui/mui-x
      // - git@github.com:mui/mui-x.git
      return /mui\/mui-x(\.git)?$/.test(remote.url) && remote.method === '(push)';
    });
}

async function main(argv) {
  const { dryRun } = argv;

  const exec = dryRun ? execDry : execActual;

  const rootWorkspace = getWorkspaceRoot();
  const rootWorkspaceManifest = await fse.readJSON(path.join(rootWorkspace, 'package.json'));

  const tag = `v${rootWorkspaceManifest.version}`;
  const message = `Version ${rootWorkspaceManifest.version}`;

  await exec(['git', 'tag', '-a', tag, '-m', `"${message}"`].join(' '));
  // eslint-disable-next-line no-console -- verbose logging
  console.log(`Created tag '${tag}'. To remove enter 'git tag -d ${tag}'`);

  const muiXRemote = await findMuiXRemote();
  if (muiXRemote === undefined) {
    throw new TypeError(
      'Unable to find the upstream remote. It should be a remote pointing to "mui/mui-x". ' +
        'Did you forget to add it via `git remote add upstream git@github.com:mui/mui-x.git`? ' +
        'If you think this is a bug please include `git remote -v` in your report.',
    );
  }

  await exec(['git', 'push', muiXRemote.name, 'tag', tag].join(' '));

  // eslint-disable-next-line no-console -- verbose logging
  console.log(
    `Pushed tag '${tag}' to ${muiXRemote.name}. This should not be reversed. In case of emergency enter 'git push --delete ${muiXRemote.name} ${tag}' to remove.`,
  );
}

yargs(hideBin(process.argv))
  .command({
    command: '$0',
    description: 'Tags the current release and pushes these changes to mui/mui-x.',
    builder: (command) => {
      return command.option('dryRun', {
        default: false,
        describe: 'If true, the script will not have any permanent side-effects.',
        type: 'boolean',
      });
    },
    handler: main,
  })
  .help()
  .strict(true)
  .version(false)
  .parse();
