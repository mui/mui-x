#!/usr/bin/env node
/**
 * This module provides utilities for generating a changelog for MUI X packages.
 *
 * Features:
 * - Fetches commits between two Git references (tags/branches)
 * - Categorizes commits based on tags in commit messages and PR labels
 * - Generates a changelog with sections for different packages
 * - Uses actual versions from package.json files
 * - Can return the changelog as a string when returnEntry is true
 */
import fs from 'fs';
import path from 'path';

const ORG = 'mui';
const REPO = 'mui-x';

/**
 * @type {string[]}
 * Labels to exclude from the changelog
 */
const excludeLabels = ['dependencies', 'scope: scheduler'];

/**
 * @type {string[]}
 * Tags found in title to exclude the commit from the changelog
 */
const excludeTitleTags = ['[charts-premium]'];

/**
 * @type {string}
 * Formatted current date for the changelog
 */
const nowFormatted = new Date().toLocaleDateString('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

/**
 * Global variable to store the Octokit instance
 * @type {import('@octokit/rest').Octokit | null}
 */
let octokit = null;

/**
 * Get the version of a package from its package.json file
 * @param {string} packageName - The name of the package (e.g. 'x-data-grid')
 * @returns {string} The version of the package
 */
function getPackageVersion(packageName) {
  try {
    // Construct the path to the package.json file
    const packageJsonPath = path.join(process.cwd(), 'packages', packageName, 'package.json');

    // Check if the file exists
    if (!fs.existsSync(packageJsonPath)) {
      console.warn(`Package.json not found for ${packageName} at ${packageJsonPath}`);
      return '__VERSION__'; // Fallback to placeholder
    }

    // Read and parse the package.json file
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // Check if the version field exists
    if (!packageJson.version) {
      console.warn(`No version field found in package.json for ${packageName}`);
      return '__VERSION__'; // Fallback to placeholder
    }

    return packageJson.version;
  } catch (error) {
    console.error(`Error reading package.json for ${packageName}:`, error);
    return '__VERSION__'; // Fallback to placeholder
  }
}

/**
 * Removes duplicate empty lines from a string.
 * @param {string} text - The text to process
 * @returns {string} The text with duplicate empty lines removed
 */
function removeDuplicateEmptyLines(text) {
  return text
    .replace(/\n\s*\n\s*\n/g, '\n\n') // Replace multiple empty lines with double line break
    .trim(); // Remove leading/trailing whitespace
}

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
 * Find the latest tagged version from GitHub
 * @returns {Promise<string>} The latest tagged version
 */
async function findLatestTaggedVersion() {
  // fetch tags from the GitHub API and return the last one
  const { data: tags } = await octokit.rest.repos.listTags({
    owner: ORG,
    repo: REPO,
  });
  return tags[0].name.trim();
}

function resolvePackagesByLabels(labels) {
  const resolvedPackages = [];
  labels.forEach((label) => {
    switch (label.name) {
      case 'scope: data grid':
        resolvedPackages.push('DataGrid');
        break;
      case 'scope: pickers':
        resolvedPackages.push('pickers');
        break;
      case 'scope: charts':
        resolvedPackages.push('charts');
        break;
      case 'scope: tree view':
        resolvedPackages.push('TreeView');
        break;
      case 'scope: scheduler':
        resolvedPackages.push('Scheduler');
        break;
      default:
        break;
    }
  });
  return resolvedPackages;
}

/**
 * Generates a changelog for MUI X packages
 * @param {object} options - The options for generating the changelog
 * @param {import('@octokit/rest').Octokit} options.octokit - The Octokit instance to use for GitHub API calls
 * @param {string} [options.lastRelease] - The release to compare against
 * @param {string} options.release - The release to generate the changelog for
 * @param {string} [options.nextVersion] - The version expected to be released
 * @param {boolean} [options.returnEntry] - Whether to return the changelog as a string
 * @returns {Promise<string|null>} The changelog string or null
 */
export async function generateChangelog({
  octokit: octokitInput,
  lastRelease: lastReleaseInput,
  release = 'master',
  nextVersion,
  returnEntry = false,
}) {
  octokit = octokitInput;

  // fetch the last tag and chose the one to use for the release
  const latestTaggedVersion = await findLatestTaggedVersion();
  const lastRelease = lastReleaseInput !== undefined ? lastReleaseInput : latestTaggedVersion;
  if (lastRelease !== latestTaggedVersion) {
    console.warn(
      `Creating changelog for ${lastRelease}..${release} when latest tagged version is '${latestTaggedVersion}'.`,
    );
  }

  // Now We will fetch all the commits between the chosen tag and release branch
  /**
   * @type {AsyncIterableIterator<import('@octokit/rest').Octokit.Response<import('@octokit/rest').Octokit.ReposCompareCommitsResponse>>}
   */
  const timeline = octokit.paginate.iterator(
    octokit.repos.compareCommits.endpoint.merge({
      owner: ORG,
      repo: REPO,
      base: lastRelease,
      head: release,
    }),
  );

  /**
   * @type {import('@octokit/rest').Octokit.ReposCompareCommitsResponseCommitsItem[]}
   */
  const commitsItems = [];
  for await (const response of timeline) {
    const { data: compareCommits } = response;
    commitsItems.push(...compareCommits.commits);
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
      } = await octokit.rest.pulls.get({
        owner: ORG,
        repo: REPO,
        pull_number: Number(searchPullRequestId[1]),
      });

      // Skip bot accounts
      if (!login.includes('[bot]')) {
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
        const message = `From https://github.com/${ORG}/${REPO}/pull/${
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
  const schedulerCommits = [];
  const schedulerProCommits = [];
  const internalCommits = [];
  const docsCommits = [];
  const otherCommits = [];
  const codemodCommits = [];

  commitsItems
    .filter((item) => !prsLabelsMap[item.sha]?.some((label) => excludeLabels.includes(label.name)))
    .filter((item) => !excludeTitleTags.some((tag) => item.commit.message.includes(tag)))
    .forEach((commitItem) => {
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
        case 'TimeRangePicker':
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
        case 'scheduler':
          schedulerCommits.push(commitItem);
          break;
        case 'scheduler-pro':
          schedulerProCommits.push(commitItem);
          break;
        case 'docs':
          docsCommits.push(commitItem);
          break;
        case 'core': // Legacy
        case 'internal':
          internalCommits.push(commitItem);
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
                case 'charts':
                  chartsCommits.push(commitItem);
                  break;
                case 'Scheduler':
                  schedulerCommits.push(commitItem);
                  break;
                default:
                  internalCommits.push(commitItem);
                  break;
              }
            });
          } else {
            otherCommits.push(commitItem);
          }
          break;
        }
        default:
          otherCommits.push(commitItem);
          break;
      }
    });

  // Helper to print a list of commits in a section of the changelog
  const logCommitEntries = (commitsList) => {
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

    return sortedCommits
      .map((commit) => `- ${commit.commit.message.split('\n')[0]} @${commit.author.login}`)
      .join('\n');
  };

  const proIcon =
    '[![pro](https://mui.com/r/x-pro-svg)](https://mui.com/r/x-pro-svg-link "Pro plan")';
  const premiumIcon =
    '[![premium](https://mui.com/r/x-premium-svg)](https://mui.com/r/x-premium-svg-link "Premium plan")';

  /**
   * Generates a changelog section for a product
   * @param {object} options - The options for generating the product section
   * @param {string} options.productName - The display name of the product (e.g., 'Data Grid', 'Charts')
   * @param {string} options.packageName - The base package name (e.g., 'x-data-grid', 'x-charts')
   * @param {import('@octokit/rest').Octokit.ReposCompareCommitsResponseCommitsItem[]} options.baseCommits - The commits for the base package
   * @param {import('@octokit/rest').Octokit.ReposCompareCommitsResponseCommitsItem[]} [options.proCommits] - The commits for the Pro package (if applicable)
   * @param {import('@octokit/rest').Octokit.ReposCompareCommitsResponseCommitsItem[]} [options.premiumCommits] - The commits for the Premium package (if applicable)
   * @param {string} [options.changelogKey] - The key to use for changelog messages (e.g., 'DataGrid', 'charts')
   * @returns {string} The formatted changelog section for the product
   */
  const logProductSection = ({
    productName,
    packageName,
    baseCommits,
    proCommits = null,
    premiumCommits = null,
    changelogKey,
  }) => {
    const hasProVersion = proCommits !== null;
    const hasPremiumVersion = premiumCommits !== null;
    const packageVersion = nextVersion ? getPackageVersion(packageName) : '__VERSION__';

    const lines = [`### ${productName}`];

    // Add changelog messages if available
    if (changeLogMessages[changelogKey]?.length > 0) {
      lines.push(...changeLogMessages[changelogKey]);
    }

    // Base package
    lines.push(`#### \`@mui/${packageName}@${packageVersion}\``);
    lines.push(`${logCommitEntries(baseCommits) || 'Internal changes.'}`);

    // Pro package (if applicable)
    if (hasProVersion) {
      lines.push(`#### \`@mui/${packageName}-pro@${packageVersion}\` ${proIcon}`);

      if (proCommits?.length > 0) {
        lines.push(`Same changes as in \`@mui/${packageName}@${packageVersion}\`, plus:`);
        lines.push(logCommitEntries(proCommits));
      } else {
        lines.push(`Same changes as in \`@mui/${packageName}@${packageVersion}\`.`);
      }
    }

    // Premium package (if applicable)
    if (hasPremiumVersion) {
      lines.push(`#### \`@mui/${packageName}-premium@${packageVersion}\` ${premiumIcon}`);

      if (premiumCommits?.length > 0) {
        lines.push(`Same changes as in \`@mui/${packageName}-pro@${packageVersion}\`, plus:`);
        lines.push(logCommitEntries(premiumCommits));
      } else {
        lines.push(`Same changes as in \`@mui/${packageName}-pro@${packageVersion}\`.`);
      }
    }

    return lines.join('\n\n');
  };

  /**
   * Generates a changelog section for a product
   * @param {object} options - The options for generating the product section
   * @param {string} options.sectionName - The name of the section (e.g., 'Docs', 'Core', 'Miscellaneous')
   * @param {import('@octokit/rest').Octokit.ReposCompareCommitsResponseCommitsItem[]} options.commits - The commits to log for the section
   * @returns {string} The formatted changelog section for the product
   */
  const logOtherSection = (options) => {
    const { sectionName, commits } = options;

    if (commits.length === 0) {
      return '';
    }

    const lines = [`### ${sectionName}`];

    // Add changelog messages if available
    if (changeLogMessages[sectionName]?.length > 0) {
      lines.push(...changeLogMessages[sectionName]);
    }

    lines.push(logCommitEntries(commits) || 'Internal changes.');

    return lines.join('\n\n');
  };

  // Log the general section of the changelog
  const logGeneralSection = () => {
    const authorsCount =
      community.contributors.size + community.firstTimers.size + community.team.size;
    const lines = [
      `We'd like to extend a big thank you to the ${authorsCount} contributors who made this release possible. Here are some highlights ✨:`,
      'TODO INSERT HIGHLIGHTS',
    ];

    if (changeLogMessages.general?.length) {
      lines.push(...changeLogMessages.general);
    }

    // TODO: separate first timers and regular contributors
    const contributors = [
      ...Array.from(community.contributors),
      ...Array.from(community.firstTimers),
    ].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

    const teamMembers = Array.from(community.team).sort((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase()),
    );

    if (contributors.length > 0) {
      lines.push(
        `Special thanks go out to the community members for their valuable contributions:\n${contributors.join(', ')}`,
      );
    }

    if (community.team.size > 0) {
      lines.push(
        `The following are all team members who have contributed to this release:\n${teamMembers.join(', ')}`,
      );
    }

    return lines.join('\n\n');
  };

  const changelog = removeDuplicateEmptyLines(`
## ${nextVersion || '__VERSION__'}
<!-- generated comparing ${lastRelease}..${release} -->
_${nowFormatted}_

${logGeneralSection()}

${logProductSection({
  productName: 'Data Grid',
  packageName: 'x-data-grid',
  baseCommits: dataGridCommits,
  proCommits: dataGridProCommits,
  premiumCommits: dataGridPremiumCommits,
  changelogKey: 'DataGrid',
})}

${logProductSection({
  productName: 'Date and Time Pickers',
  packageName: 'x-date-pickers',
  baseCommits: pickersCommits,
  proCommits: pickersProCommits,
  changelogKey: 'pickers',
})}

${logProductSection({
  productName: 'Charts',
  packageName: 'x-charts',
  baseCommits: chartsCommits,
  proCommits: chartsProCommits,
  changelogKey: 'charts',
})}

${logProductSection({
  productName: 'Tree View',
  packageName: 'x-tree-view',
  baseCommits: treeViewCommits,
  proCommits: treeViewProCommits,
  changelogKey: 'TreeView',
})}

${logProductSection({
  productName: 'Codemod',
  packageName: 'x-codemod',
  baseCommits: codemodCommits,
  changelogKey: 'codemod',
})}

${logOtherSection({
  sectionName: 'Docs',
  commits: docsCommits,
})}

${logOtherSection({
  sectionName: 'Core',
  commits: internalCommits,
})}

${logOtherSection({
  sectionName: 'Miscellaneous',
  commits: otherCommits,
})}
`);

  try {
    if (returnEntry) {
      // Return the string if returnEntry is true
      return changelog;
    }
    // Otherwise log it to the console
    // eslint-disable-next-line no-console -- output of this script
    console.log(changelog);
    return null;
  } catch (error) {
    console.error('Error generating changelog:', error);
    if (returnEntry) {
      throw error; // Re-throw the error when in returnEntry mode
    }
    return null;
  }
}
