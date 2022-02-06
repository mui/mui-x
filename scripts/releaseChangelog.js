/* eslint-disable no-restricted-syntax */
const { Octokit } = require('@octokit/rest');
const yargs = require('yargs');

const GIT_ORGANIZATION = 'mui';
const GIT_REPO = 'mui-x';

/**
 * @param {string} commitMessage
 * @returns {string} The tags in lowercases, ordered ascending and commaseparated
 */
function parseTags(commitMessage) {
  const tagMatch = commitMessage.match(/^(\[[\w-]+\])+/);
  if (tagMatch === null) {
    return '';
  }
  const [tagsWithBracketDelimiter] = tagMatch;
  return tagsWithBracketDelimiter
    .match(/([\w-]+)/g)
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
  await Promise.all(
    commitsItems.map(async (commitsItem) => {
      const searchPullRequestId = commitsItem.commit.message.match(/\(#([0-9]+)\)/);
      if (!searchPullRequestId || !searchPullRequestId[1]) {
        return;
      }

      const {
        data: { body: bodyMessage },
      } = await octokit.request('GET /repos/{owner}/{repo}/pulls/{pull_number}', {
        owner: GIT_ORGANIZATION,
        repo: GIT_REPO,
        pull_number: Number(searchPullRequestId[1]),
      });

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
  const changeCommits = [];
  const coreCommits = [];
  const docsCommits = [];
  const otherCommits = [];

  commitsItems.forEach((commitItem) => {
    const tag = parseTags(commitItem.commit.message);
    switch (tag) {
      case 'DataGrid':
      case 'DataGridPro':
      case 'DataGridPremium':
      case 'l10n':
      case '118n':
        changeCommits.push(commitItem);
        break;
      case 'docs':
        docsCommits.push(commitItem);
        break;
      case 'core':
        coreCommits.push(commitItem);
        break;
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
## TODO RELEASE NAME
<!-- generated comparing ${lastRelease}..${release} -->
_${nowFormatted}_

A big thanks to the ${
    authors.length
  } contributors who made this release possible. Here are some highlights ✨:

TODO INSERT HIGHLIGHTS
${changeLogMessages.length > 0 ? '\n\n' : ''}${changeLogMessages.join('\n')}

TODO WRITE THE VERSION
### \`@mui/x-data-grid@v\` / \`@mui/x-data-grid-pro@v\`
${logChangelogSection(changeCommits, '#### Changes')}
${logChangelogSection(docsCommits, '### Docs')}
${logChangelogSection(coreCommits, '### Core')}
${logChangelogSection(otherCommits, '')}

`;

  // eslint-disable-next-line no-console -- output of this script
  console.log(changelog);
}

yargs
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
