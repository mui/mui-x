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
      case 'component: charts':
        resolvedPackages.push('charts');
        break;
      case 'component: tree view':
        resolvedPackages.push('TreeView');
        break;
      default:
        break;
    }
  });
  return resolvedPackages;
}

async function main(argv) {
  const { githubToken, lastRelease: lastReleaseInput, release, nextVersion } = argv;

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

  const changeLogMessages = {};
  const prsLabelsMap = {};
  const community = {
    firstTimers: new Set(),
    contributors: new Set(),
    team: new Set(),
  };
  await Promise.all(
    commitsItems.map(async (commitsItem) => {
      const searchPullRequestId = commitsItem.commit.message.match(/\(#([0-9]+)\)/);
      if (!searchPullRequestId || !searchPullRequestId[1]) {
        return;
      }

      const {
        data: {
          body: bodyMessage,
          labels,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          author_association,
          user: { login },
        },
      } = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}', {
        owner: GIT_ORGANIZATION,
        repo: GIT_REPO,
        pull_number: Number(searchPullRequestId[1]),
      });

      switch (author_association) {
        case 'CONTRIBUTOR':
          community.contributors.add(`@${login}`);
          break;
        case 'FIRST_TIMER':
          community.firstTimers.add(`@${login}`);
          break;
        case 'MEMBER':
          community.team.add(`@${login}`);
          break;
        default:
      }

      prsLabelsMap[commitsItem.sha] = labels;

      if (!bodyMessage) {
        return;
      }

      const changelogMotif = '## changelog';
      const lowercaseBody = bodyMessage.toLowerCase();
      // Check if the body contains a line starting with '## changelog'
      const matchedChangelog = lowercaseBody.matchAll(new RegExp(`^${changelogMotif}`, 'gim'));
      const changelogMatches = Array.from(matchedChangelog);
      if (changelogMatches.length > 0) {
        const prLabels = prsLabelsMap[commitsItem.sha];
        const resolvedPackage = resolvePackagesByLabels(prLabels)[0];
        const changelogIndex = changelogMatches[0].index;
        const message = `From https://github.com/${GIT_ORGANIZATION}/${GIT_REPO}/pull/${
          searchPullRequestId[1]
        }\n${bodyMessage.slice(changelogIndex + changelogMotif.length)}`;
        if (changeLogMessages[resolvedPackage || 'general']) {
          changeLogMessages[resolvedPackage || 'general'].push(message);
        } else {
          changeLogMessages[resolvedPackage || 'general'] = [message];
        }
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
  const treeViewProCommits = [];
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
      case 'RichTreeView':
      case 'tree view':
      case 'TreeItem':
        treeViewCommits.push(commitItem);
        break;
      case 'RichTreeViewPro':
      case 'tree view pro':
        treeViewProCommits.push(commitItem);
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

  const logChangelogMessages = (product) => {
    if (!changeLogMessages[product]?.length) {
      return '';
    }
    return `${changeLogMessages[product].length > 0 ? '\n' : ''}${changeLogMessages[product].join('\n\n')}`;
  };

  const nowFormatted = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const logCommunitySection = () => {
    // TODO: separate first timers and regular contributors
    const contributors = [
      ...Array.from(community.contributors),
      ...Array.from(community.firstTimers),
    ].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    if (contributors.length === 0) {
      return '';
    }

    return `Special thanks go out to the community contributors who have helped make this release possible:\n${contributors.join(', ')}.`;
  };

  const logTeamSection = () => {
    return `Following are all team members who have contributed to this release:\n${Array.from(
      community.team,
    )
      .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
      .join(', ')}.`;
  };

  const changelog = `
## __VERSION__
<!-- generated comparing ${lastRelease}..${release} -->
_${nowFormatted}_

We'd like to offer a big thanks to the ${
    authors.length
  } contributors who made this release possible. Here are some highlights ✨:

TODO INSERT HIGHLIGHTS
${logChangelogMessages('general')}
${logCommunitySection()}
${logTeamSection()}

<!--/ HIGHLIGHT_ABOVE_SEPARATOR /-->

### Data Grid
${logChangelogMessages('DataGrid')}
#### \`@mui/x-data-grid@__VERSION__\`

${logChangelogSection(dataGridCommits) || `No changes since \`@mui/x-data-grid@${lastRelease}\`.`}

#### \`@mui/x-data-grid-pro@__VERSION__\` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in \`@mui/x-data-grid@__VERSION__\`${
    dataGridProCommits.length > 0 ? ', plus:\n' : '.'
  }
${logChangelogSection(dataGridProCommits)}${dataGridProCommits.length > 0 ? '\n' : ''}
#### \`@mui/x-data-grid-premium@__VERSION__\` [![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link 'Premium plan')

Same changes as in \`@mui/x-data-grid-pro@__VERSION__\`${
    dataGridPremiumCommits.length > 0 ? ', plus:\n' : '.'
  }
${logChangelogSection(dataGridPremiumCommits)}${dataGridPremiumCommits.length > 0 ? '\n' : ''}
### Date and Time Pickers
${logChangelogMessages('pickers')}
#### \`@mui/x-date-pickers@__VERSION__\`

${logChangelogSection(pickersCommits) || `No changes since \`@mui/x-date-pickers@${lastRelease}\`.`}

#### \`@mui/x-date-pickers-pro@__VERSION__\` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in \`@mui/x-date-pickers@__VERSION__\`${
    pickersProCommits.length > 0 ? ', plus:\n' : '.'
  }
${logChangelogSection(pickersProCommits)}${pickersProCommits.length > 0 ? '\n' : ''}
### Charts
${logChangelogMessages('charts')}
#### \`@mui/x-charts@__VERSION__\`

${logChangelogSection(chartsCommits) || `No changes since \`@mui/x-charts@${lastRelease}\`.`}

#### \`@mui/x-charts-pro@__VERSION__\` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in \`@mui/x-charts@__VERSION__\`${chartsProCommits.length > 0 ? ', plus:\n' : '.'}
${logChangelogSection(chartsProCommits)}${chartsProCommits.length > 0 ? '\n' : ''}
### Tree View
${logChangelogMessages('TreeView')}
#### \`@mui/x-tree-view@__VERSION__\` 
${logChangelogSection(treeViewProCommits) || `No changes since \`@mui/x-tree-view-pro@${lastRelease}\`.`}

#### \`@mui/x-tree-view-pro@__VERSION__\` [![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link 'Pro plan')

Same changes as in \`@mui/x-tree-view@__VERSION__\`${treeViewProCommits.length > 0 ? ', plus:\n' : '.'}
${logChangelogSection(treeViewProCommits)}${treeViewProCommits.length > 0 ? '\n' : ''}
${logChangelogSection(codemodCommits, `### \`@mui/x-codemod@__VERSION__\``)}
${logChangelogSection(docsCommits, '### Docs')}
${logChangelogSection(coreCommits, '### Core')}
${logChangelogSection(otherCommits, '')}

`;

  // eslint-disable-next-line no-console -- output of this script
  console.log(nextVersion ? changelog.replace(/__VERSION__/g, nextVersion) : changelog);
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
        })
        .option('nextVersion', {
          describe:
            'The version expected to be released e.g. `5.2.0`. Replaces `_VERSION__` placeholder in the changelog.',
          type: 'string',
        });
    },
    handler: main,
  })
  .help()
  .strict(true)
  .version(false)
  .parse();
