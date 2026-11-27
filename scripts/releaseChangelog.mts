import { parseArgs } from 'node:util';
import { fetchChangelogData } from '@mui/internal-code-infra/changelog';
import { renderChangelog } from './changelog.mts';

const REPO = 'mui-x';

const HELP = `Prints the changelog of a release.

Options:
  --lastRelease  Git reference (tag/commit) of the last release. Defaults to the last version tag.
  --release      Git reference (tag/branch) of the new release. Defaults to master on GitHub.
  --nextVersion  Version of the new release, such as 5.2.0. Defaults to __VERSION__ placeholders.
  --help         Show this help.`;

const { values } = parseArgs({
  options: {
    lastRelease: { type: 'string' },
    // #target-branch-reference
    // Replace `master` with the new branch `vX.x` when creating the first PR on the vX.x branch
    // For example, when creating v9 from v8, `master -> v8.x`
    release: { type: 'string', default: 'master' },
    nextVersion: { type: 'string' },
    help: { type: 'boolean' },
  },
});

function print(text: string) {
  process.stdout.write(`${text}\n`);
}

if (values.help) {
  print(HELP);
} else {
  const data = await fetchChangelogData({
    repo: REPO,
    lastRelease: values.lastRelease,
    release: values.release,
  });

  print(renderChangelog(data, values.nextVersion));
}
