/* eslint-disable no-restricted-syntax */
const { Octokit } = require('@octokit/rest');
const childProcess = require('child_process');
const { promisify } = require('util');
const yargs = require('yargs');

const exec = promisify(childProcess.exec);

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
  const { data } = await octokit.request('GET /repos/mui-org/material-ui-x/tags');
  return data[0].name.trim();
}

async function main(argv) {
  const { githubToken, lastRelease: lastReleaseInput, release } = argv;

  if (!githubToken) {
    throw new TypeError(
      'Unable to authenticate. Make sure you either call the script with `--githubToken $token` or set `process.env.GITHUB_TOKEN`. The token needs `public_repo` permissions.',
    );
  }
  const octokit = new Octokit({
    auth: githubToken,
  });

  const latestTaggedVersion = await findLatestTaggedVersion(octokit);
  const lastRelease = lastReleaseInput !== undefined ? lastReleaseInput : latestTaggedVersion;
  if (lastRelease !== latestTaggedVersion) {
    console.warn(
      `Creating changelog for ${latestTaggedVersion}..${release} when latest tagged version is '${latestTaggedVersion}'.`,
    );
  }

  /**
   * @type {AsyncIterableIterator<Octokit.Response<Octokit.ReposCompareCommitsResponse>>}
   */
  const timeline = octokit.paginate.iterator(
    octokit.repos.compareCommits.endpoint.merge({
      owner: 'mui-org',
      repo: 'material-ui-x',
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

  const authors = Array.from(
    new Set(
      commitsItems.map((commitsItem) => {
        return commitsItem.author.login;
      }),
    ),
  );

  const changeCommits = [];
  const coreCommits = [];
  const docsCommits = [];
  const otherCommits = [];

  commitsItems.forEach((commitItem) => {
    const tag = parseTags(commitItem.commit.message);
    switch (tag) {
      case 'DataGrid':
      case 'DataGridPro':
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

  const getCommitCategories = (commitsList, header) => {
    if (commitsList.length === 0) {
      return '';
    }
    const commitsItemsByDateDesc = commitsList.slice().reverse();

    const sortedCommits = commitsList.sort((a, b) => {
      const aTags = parseTags(a.commit.message);
      const bTags = parseTags(b.commit.message);
      if (aTags === bTags) {
        return commitsItemsByDateDesc.indexOf(a) - commitsItemsByDateDesc.indexOf(b);
      }
      return aTags.localeCompare(bTags);
    });
    return `${header}

${sortedCommits
  .sort()
  .map((commitItem) => `- ${commitItem.commit.message} @${commitItem.author.login}`)
  .join('\n')}
`;
  };

  // We don't know when a particular commit was made from the API.
  // Only that the commits are ordered by date ASC
  const commitsItemsByDateDesc = commitsItems.slice().reverse();
  // Sort by tags ASC, date desc
  // Will only consider exact matches of tags so `[Slider]` will not be grouped with `[Slider][Modal]`
  commitsItems.sort((a, b) => {
    const aTags = parseTags(a.commit.message);
    const bTags = parseTags(b.commit.message);
    if (aTags === bTags) {
      return commitsItemsByDateDesc.indexOf(a) - commitsItemsByDateDesc.indexOf(b);
    }
    return aTags.localeCompare(bTags);
  });

  const nowFormated = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const changelog = `
## TODO RELEASE NAME
<!-- generated comparing ${lastRelease}..${release} -->
_${nowFormated}_
A big thanks to the ${
    authors.length
  } contributors who made this release possible. Here are some highlights ✨:
TODO INSERT HIGHLIGHTS

${getCommitCategories(changeCommits, '### Changes')}
${getCommitCategories(coreCommits, '### Core')}
${getCommitCategories(docsCommits, '### Docs')}
${getCommitCategories(otherCommits, '')}

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
