/* eslint-disable no-restricted-syntax */
import { Octokit } from '@octokit/rest';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const GIT_ORGANIZATION = 'mui';
const GIT_REPO = 'mui-x';

/**
 * @param {string} commitMessage
 * @returns {string} The tags in lowercases, ordered ascending and comma-separated
 */
function parseTags(commitMessage) {
  const tagMatch = commitMessage.match(/^(\[[\w- ]+\])+/);
  if (tagMatch === null) {
    return '';
  }
  const [tagsWithBracketDelimiter] = tagMatch;
  return tagsWithBracketDelimiter
    .match(/([\w- ]+)/g)
    .map((tag) => {
      return tag;
    })
    .sort((a, b) => {
      return a.localeCompare(b);
    })
    .join(',');
}

/**
 * @param {Octokit.ReposCompareCommitsResponseCommitsItem} commitsItem
 */
function filterCommit(commitsItem) {
  // TODO: Use labels

  // Filter dependency updates
  return !commitsItem.commit.message.startsWith('Bump');
}

async function findLatestTaggedVersion(octokit) {
  // fetch tags from the GitHub API and return the last one
  const { data } = await octokit.request(`GET /repos/${GIT_ORGANIZATION}/${GIT_REPO}/tags`);
  return data[0].name.trim();
}

function resolvePackagesByLabels(labels) {
  const resolvedPackages = [];
  labels.forEach((label) => {
    switch (label.name) {
      case 'component: data grid':
        resolvedPackages.push('DataGrid');
        break;
      case 'component: pickers':
        resolvedPackages.push('pickers');
        break;
      default:
        break;
    }
  });
  return resolvedPackages;
}

async function main(argv) {
  const { githubToken, lastRelease: lastReleaseInput, release } = argv;

  if (!githubToken) {
    throw new TypeError(
      'Unable to authenticate. Make sure you either call the script with `--githubToken $token` or set `process.env.GITHUB_TOKEN`. The token needs `public_repo` permissions.',
    );
  }
  // Initialize the API client
  const octokit = new Octokit({
    auth: githubToken,
  });

  // fetch the last tag and chose the one to use for the release
  const latestTaggedVersion = await findLatestTaggedVersion(octokit);
  const lastRelease = lastReleaseInput !== undefined ? lastReleaseInput : latestTaggedVersion;
  if (lastRelease !== latestTaggedVersion) {
    console.warn(
      `Creating changelog for ${latestTaggedVersion}..${release} when latest tagged version is '${latestTaggedVersion}'.`,
    );
  }

  // Now We will fetch all the commits between the chosen tag and release branch
  /**
   * @type {AsyncIterableIterator<Octokit.Response<Octokit.ReposCompareCommitsResponse>>}
   */
  const timeline = octokit.paginate.iterator(
    octokit.repos.compareCommits.endpoint.merge({
      owner: GIT_ORGANIZATION,
      repo: GIT_REPO,
      base: lastRelease,
      head: release,
    }),
  );

  /**
   * @type {Octokit.ReposCompareCommitsResponseCommitsItem[]}
   */
  const commitsItems = [];
  for await (const response of timeline) {
    const { data: compareCommits } = response;
    commitsItems.push(...compareCommits.commits.filter(filterCommit));
  }

  // Fetch all the pull Request and check if there is a section named changelog

  const changeLogMessages = [];
  const prsLabelsMap = {};
  await Promise.all(
    commitsItems.map(async (commitsItem) => {
      const searchPullRequestId = commitsItem.commit.message.match(/\(#([0-9]+)\)/);
      if (!searchPullRequestId || !searchPullRequestId[1]) {
        return;
      }

      const {
        data: { body: bodyMessage, labels },
      } = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}', {
        owner: GIT_ORGANIZATION,
        repo: GIT_REPO,
        pull_number: Number(searchPullRequestId[1]),
      });

      prsLabelsMap[commitsItem.sha] = labels;

      if (!bodyMessage) {
        return;
      }

      const changelogMotif = '# changelog';
      const changelogIndex = bodyMessage.toLowerCase().indexOf(changelogMotif);
      if (changelogIndex >= 0) {
        changeLogMessages.push(
          `From https://github.com/${GIT_ORGANIZATION}/${GIT_REPO}/pull/${
            searchPullRequestId[1]
          }\n${bodyMessage.slice(changelogIndex + changelogMotif.length)}`,
        );
      }
    }),
  );

  // Get all the authors of the release
  const authors = Array.from(
    new Set(
      commitsItems.map((commitsItem) => {
        return commitsItem.author.login;
      }),
    ),
  );

  // Dispatch commits in different sections
  const dataGridCommits = [];
  const dataGridProCommits = [];
  const dataGridPremiumCommits = [];
  const pickersCommits = [];
  const pickersProCommits = [];
  const chartsCommits = [];
  const chartsProCommits = [];
  const treeViewCommits = [];
  const coreCommits = [];
  const docsCommits = [];
  const otherCommits = [];
  const codemodCommits = [];

  commitsItems.forEach((commitItem) => {
    const tag = parseTags(commitItem.commit.message);
    // for now we use only one parsed tag
    const firstTag = tag.split(',')[0];
    switch (firstTag) {
      case 'DataGrid':
      case 'data grid':
        dataGridCommits.push(commitItem);
        break;
      case 'DataGridPro':
        dataGridProCommits.push(commitItem);
        break;
      case 'DataGridPremium':
        dataGridPremiumCommits.push(commitItem);
        break;
      case 'DatePicker':
      case 'TimePicker':
      case 'DateTimePicker':
      case 'pickers':
      case 'fields':
        pickersCommits.push(commitItem);
        break;
      case 'DateRangePicker':
      case 'DateTimeRangePicker':
        pickersProCommits.push(commitItem);
        break;
      case 'charts-pro':
        chartsProCommits.push(commitItem);
        break;
      case 'charts':
        chartsCommits.push(commitItem);
        break;
      case 'TreeView':
      case 'tree view':
        treeViewCommits.push(commitItem);
        break;
      case 'docs':
        docsCommits.push(commitItem);
        break;
      case 'core':
        coreCommits.push(commitItem);
        break;
      case 'codemod':
        codemodCommits.push(commitItem);
        break;
      case 'l10n':
      case '118n': {
        const prLabels = prsLabelsMap[commitItem.sha];
        const resolvedPackages = resolvePackagesByLabels(prLabels);
        if (resolvedPackages.length > 0) {
          resolvedPackages.forEach((resolvedPackage) => {
            switch (resolvedPackage) {
              case 'DataGrid':
                dataGridCommits.push(commitItem);
                break;
              case 'pickers':
                pickersCommits.push(commitItem);
                break;
              default:
                coreCommits.push(commitItem);
                break;
            }
          });
        }
        break;
      }
      default:
        otherCommits.push(commitItem);
        break;
    }
  });

  // Helper to print a list of commits in a section of the changelog
  const logChangelogSection = (commitsList, header) => {
    if (commitsList.length === 0) {
      return '';
    }

    const sortedCommits = commitsList.sort((a, b) => {
      const aTags = parseTags(a.commit.message);
      const bTags = parseTags(b.commit.message);
      if (aTags === bTags) {
        return a.commit.message < b.commit.message ? -1 : 1;
      }
      return aTags.localeCompare(bTags);
    });
    return `${header ? `\n${header}\n\n` : ''}${sortedCommits
      .sort()
      .map(
        (commitItem) => `- ${commitItem.commit.message.split('\n')[0]} @${commitItem.author.login}`,
      )
      .join('\n')}`;
  };

  const nowFormatted = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const changelog = `
## __VERSION__
<!-- generated comparing ${lastRelease}..${release} -->
_${nowFormatted}_

We'd like to offer a big thanks to the ${
    authors.length
  } contributors who made this release possible. Here are some highlights ✨:

TODO INSERT HIGHLIGHTS
${changeLogMessages.length > 0 ? '\n\n' : ''}${changeLogMessages.join('\n')}

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid

#### \`@mui/x-data-grid@__VERSION__\`

${logChangelogSection(dataGridCommits)}

#### \`@mui/x-data-grid-pro@__VERSION__\` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in \`@mui/x-data-grid@__VERSION__\`${
    dataGridProCommits.length > 0 ? ', plus:\n' : '.'
  }
${logChangelogSection(dataGridProCommits)}

#### \`@mui/x-data-grid-premium@__VERSION__\` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in \`@mui/x-data-grid-pro@__VERSION__\`${
    dataGridPremiumCommits.length > 0 ? ', plus:\n' : '.'
  }
${logChangelogSection(dataGridPremiumCommits)}${dataGridPremiumCommits.length > 0 ? '\n' : ''}
### Date and Time Pickers

#### \`@mui/x-date-pickers@__VERSION__\`

${logChangelogSection(pickersCommits)}

#### \`@mui/x-date-pickers-pro@__VERSION__\` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in \`@mui/x-date-pickers@__VERSION__\`${
    pickersProCommits.length > 0 ? ', plus:\n' : '.'
  }
${logChangelogSection(pickersProCommits)}

### Charts
 
#### \`@mui/x-charts@__VERSION__\`

${logChangelogSection(chartsCommits)}

#### \`@mui/x-date-charts-pro@__VERSION-ALPHA__\` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in \`@mui/x-charts@__VERSION__\`${chartsProCommits.length > 0 ? ', plus:\n' : '.'}
${logChangelogSection(chartsProCommits)}

### Tree View

#### \`@mui/x-tree-view@__VERSION__\`

${logChangelogSection(treeViewCommits)}
${logChangelogSection(codemodCommits, `### \`@mui/x-codemod@__VERSION__\``)}
${logChangelogSection(docsCommits, '### Docs')}
${logChangelogSection(coreCommits, '### Core')}
${logChangelogSection(otherCommits, '')}

`;

  // eslint-disable-next-line no-console -- output of this script
  console.log(changelog);
}

yargs(hideBin(process.argv))
  .command({
    command: '$0',
    description: 'Creates a changelog',
    builder: (command) => {
      return command
        .option('lastRelease', {
          describe:
            'The release to compare against e.g. `v5.0.0-alpha.23`. Default: The latest tag on the current branch.',
          type: 'string',
        })
        .option('githubToken', {
          default: process.env.GITHUB_TOKEN,
          describe:
            'The personal access token to use for authenticating with GitHub. Needs public_repo permissions.',
          type: 'string',
        })
        .option('release', {
          // #default-branch-switch
          default: 'master',
          describe: 'Ref which we want to release',
          type: 'string',
        });
    },
    handler: main,
  })
  .help()
  .strict(true)
  .version(false)
  .parse();
