#!/usr/bin/env node
/* eslint-disable no-console,consistent-return */
/**
 * MUI-X Release Preparation Script
 *
 * This script automates the release preparation process for MUI-X:
 * 1. Asking for the major version to update (v7.x, v6.x, etc.)
 * 2. Creating a release branch
 * 3. Determining the new version:
 *    - For non-latest major versions: patch/minor/custom
 *    - For latest major version: patch/minor/major/custom and prerelease options:
 *      - Start alpha prerelease (if no prerelease exists)
 *      - Increase alpha version or start beta (if alpha exists)
 *      - Increase beta version or go to major (if beta exists)
 * 4. Creating a new branch from upstream/master (for latest major) or upstream/vX.x (for older versions)
 * 5. Updating the root package.json with the new version
 * 6. Running the lerna version script to update all package versions
 * 7. Generating the changelog with actual package versions
 * 8. Adding the new changelog entry to the CHANGELOG.md file
 * 9. Waiting for user confirmation to review changes
 * 10. Committing the changes to the branch
 * 11. Opening a PR with a title "[release] v<NEW_VERSION>" and label "release"
 *     with a checklist of all release steps
 */

import { execa } from 'execa';
import { Octokit } from '@octokit/rest';
import { retry } from '@octokit/plugin-retry';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import fs from 'fs/promises';
import path from 'path';
import { input, select, confirm } from '@inquirer/prompts';
import { generateChangelog as generateChangelogFromModule } from './changelogUtils.mjs';
import pck from '../package.json' with { type: 'json' };

const packageVersion = pck.version;

/**
 * Create a custom Octokit class with retry functionality
 * @type {typeof import('@octokit/rest').Octokit}
 */
const MyOctokit = Octokit.plugin(retry);

/**
 * Global variable to store the Octokit instance
 * @type {import('@octokit/rest').Octokit | null}
 */
let octokit = null;

const ORG = 'mui';
const REPO = 'mui-x';

// we need to disable the no-useless-escape to include the `/` in the regex single character capturing group
const getRemoteRegex = (owner) =>
  new RegExp(String.raw`([\/:])${owner}\/${REPO}(\.git)?\s+\(push\)`);

/**
 * Command line arguments for the script
 * @typedef {object} ArgvOptions
 * @property {boolean} [patch] - Create a patch release
 * @property {boolean} [minor] - Create a minor release
 * @property {boolean} [major] - Create a major release
 * @property {string} [custom] - Create a release with a custom version number
 * @property {string} [githubToken] - GitHub token for authentication
 */

/**
 * Parse command line arguments
 * @type {ArgvOptions}
 */
const argv = yargs(hideBin(process.argv))
  .option('patch', {
    type: 'boolean',
    description: 'Create a patch release',
  })
  .option('minor', {
    type: 'boolean',
    description: 'Create a minor release',
  })
  .option('major', {
    type: 'boolean',
    description: 'Create a major release',
  })
  .option('custom', {
    type: 'string',
    description: 'Create a release with a custom version number',
  })
  .help()
  .alias('help', 'h')
  .parseSync();

/**
 * Find the remote pointing to mui/mui-x
 * @returns {Promise<string>} The name of the remote
 */
async function findMuiXRemote() {
  try {
    const { stdout } = await execa('git', ['remote', '-v']);
    const remotes = stdout.split('\n');
    // we need to disable the no-useless-escape to include the `/` in the regex single character capturing group
    const rx = getRemoteRegex(ORG);

    console.log('Checking for MUI-X remote...', stdout);

    let upstreamRemote = '';
    for (const line of remotes) {
      if (line.match(rx)) {
        upstreamRemote = line.split(/\s+/)[0];
        break;
      }
    }

    if (!upstreamRemote) {
      console.error(
        "Error: Unable to find the upstream remote. It should be a remote pointing to 'mui/mui-x'.",
      );
      console.error(
        "Did you forget to add it via 'git remote add upstream git@github.com:mui/mui-x.git'?",
      );
      process.exit(1);
    }

    return upstreamRemote;
  } catch (error) {
    console.error('Error finding MUI-X remote:', error);
    process.exit(1);
  }
}

/**
 * Find the username or organization name from the authenticated GitHub user
 * @returns {Promise<string>} The username or organization name
 */
async function findForkOwner() {
  try {
    console.log('Getting authenticated GitHub user...');

    // Get the authenticated user from GitHub API
    const { data: user } = await octokit.rest.users.getAuthenticated();
    const owner = user.login;

    if (!owner) {
      console.error('Error: Unable to get the authenticated GitHub user.');
      process.exit(1);
    }

    console.log(`Found authenticated user: ${owner}`);
    return owner;
  } catch (error) {
    console.error('Error finding authenticated user:', error);
    process.exit(1);
  }
}

/**
 * Find the remote name of the fork for the repo
 * @returns {Promise<string>} The name of the remote
 */
async function findForkRemote() {
  try {
    // Get the fork owner (username)
    const forkOwner = await findForkOwner();

    // Get all remotes
    const { stdout } = await execa('git', ['remote', '-v']);
    const remotes = stdout.split('\n');

    console.log('Checking for fork remote...');

    // Look for a remote that points to the fork owner's repository
    let forkRemote = '';
    for (const line of remotes) {
      // we need to disable the no-useless-escape to include the `/` in the regex single character capturing group
      const rx = getRemoteRegex(forkOwner);

      if (line.match(rx)) {
        forkRemote = line.split(/\s+/)[0];
        break;
      }
    }

    // If no fork remote is found, default to 'origin'
    if (!forkRemote) {
      console.log('No specific fork remote found, defaulting to "origin"');
      return 'origin';
    }

    console.log(`Found fork remote: ${forkRemote}`);
    return forkRemote;
  } catch (error) {
    console.error('Error finding fork remote:', error);
    console.log('Defaulting to "origin" as fork remote');
    return 'origin';
  }
}

/**
 * Find the latest major version from the upstream remote
 * @returns {Promise<string>} The latest major version (e.g., '7', '6', etc.)
 */
async function findLatestMajorVersion() {
  try {
    // fetch tags from the GitHub API and return the last one
    const { data: tags } = await octokit.rest.repos.listTags({
      owner: ORG,
      repo: REPO,
    });
    const tagName = tags[0].name.trim();
    const match = tagName.match(/^v(\d+)\.(\d+)\.(\d+)/);
    if (!match) {
      console.error(`Error: Unable to parse version from tag ${tagName}`);
      process.exit(1);
    }
    return match[1];
  } catch (error) {
    console.error('Error finding latest major version:', error);
    process.exit(1);
  }
}

/**
 * Compares and sorts version strings extracted from tags following semantic versioning logic.
 * @param {string} a The first tag string prefixed with 'v' (e.g., 'v1.2.3-alpha.1').
 * @param {string} b The second tag string prefixed with 'v' (e.g., 'v1.2.3').
 * @return {number} A negative number if `a` is less than `b`, a positive number if `a` is greater than `b`, or 0 if they are equal.
 */
function sortVersionsFromTags(a, b) {
  // Sort versions using semver logic
  // Remove 'v' prefix
  const aVersion = a.substring(1);
  const bVersion = b.substring(1);

  // Split into version parts and prerelease parts
  const [aVersionPart, aPrereleasePart] = aVersion.split('-');
  const [bVersionPart, bPrereleasePart] = bVersion.split('-');

  // Compare version parts (major.minor.patch)
  const aParts = aVersionPart.split('.').map(Number);
  const bParts = bVersionPart.split('.').map(Number);

  for (let i = 0; i < 3; i += 1) {
    if (aParts[i] !== bParts[i]) {
      return aParts[i] - bParts[i];
    }
  }

  // If version parts are equal, handle prerelease parts

  // If one has prerelease and the other doesn't, the one without prerelease is greater
  if (!aPrereleasePart && bPrereleasePart) {
    return 1;
  }
  if (aPrereleasePart && !bPrereleasePart) {
    return -1;
  }
  if (!aPrereleasePart && !bPrereleasePart) {
    return 0;
  }

  // Both have prerelease parts, compare them
  const aPrereleaseParts = aPrereleasePart.split('.');
  const bPrereleaseParts = bPrereleasePart.split('.');

  // Compare prerelease identifiers (alpha, beta, etc.)
  if (aPrereleaseParts[0] !== bPrereleaseParts[0]) {
    // alphabetical order for identifiers, since we basically only use alpha and beta
    return aPrereleaseParts[0].localeCompare(bPrereleaseParts[0]);
  }

  // Same prerelease identifier, compare the version number
  if (aPrereleaseParts.length > 1 && bPrereleaseParts.length > 1) {
    return Number(aPrereleaseParts[1]) - Number(bPrereleaseParts[1]);
  }

  // this should never happen, but just in case
  // If one has a version number and the other doesn't, the one with version is greater
  return aPrereleaseParts.length - bPrereleaseParts.length;
}

/**
 * Find the latest version for a specific major version
 * @param majorVersion - The major version to search for (e.g., '7', '6', etc.)
 * @returns {Promise<*|null>} - The latest tag for the specified major version, or null if not found
 */
async function findLastVersionForMajor(majorVersion) {
  try {
    const { stdout } = await execa('git', ['tag', '-l', `v${majorVersion}.*`]);
    const tags = stdout.split('\n').filter(Boolean).sort(sortVersionsFromTags);

    if (tags.length === 0) {
      console.warn(`Warning: No tags found for major version ${majorVersion}`);
      return null;
    }
    return tags[tags.length - 1].substring(1); // Remove 'v' prefix
  } catch (error) {
    console.error('Error finding latest tag for major version:', error);
    return null;
  }
}

/**
 * Select the major version to update
 * @param {string} latestMajorVersion - The latest major version found from the upstream remote
 * @returns {Promise<string>} The selected major version
 */
async function selectMajorVersion(latestMajorVersion) {
  const currentMajorVersion = packageVersion.split('.')[0];

  const majorVersion = await input({
    message: 'Please select the major version you are trying to update:',
    default: currentMajorVersion,
    validate: (answer) => {
      if (!/^\d+$/.test(answer)) {
        return 'Major version must be a number';
      }

      if (parseInt(answer, 10) > parseInt(latestMajorVersion, 10)) {
        return `Cannot select a major version (${answer}) higher than the current major version (${latestMajorVersion})`;
      }

      return true;
    },
  });

  console.log(`Selected major version: ${majorVersion}`);
  return majorVersion;
}

/**
 * Calculate versions from git tags
 * @param {string} lastVersion - The selected major version
 * @returns {Promise<{
 *   success: boolean,
 *   nextPatch?: string,
 *   nextMinor?: string,
 *   nextMajor?: string
 * }>}
 */
async function getNextSemanticVersions(lastVersion) {
  try {
    // Split into version parts and prerelease parts
    const [versionPart] = lastVersion.split('-');

    // Split the version part into components
    const [tagMajor, tagMinor, tagPatch] = versionPart.split('.').map(Number);

    // Calculate next versions
    const nextPatchVersion = `${tagMajor}.${tagMinor}.${tagPatch + 1}`;
    const nextMinorVersion = `${tagMajor}.${tagMinor + 1}.0`;
    const nextMajorVersion = `${tagMajor + 1}.0.0`;

    return {
      success: true,
      nextPatch: nextPatchVersion,
      nextMinor: nextMinorVersion,
      nextMajor: nextMajorVersion,
    };
  } catch (error) {
    console.error('Error calculating versions from tags:', error);
    return { success: false };
  }
}

/**
 * Select the version type based on the current version and selected major version
 * @param {string} majorVersion - The selected major version
 * @returns {Promise<{
 *   versionType: 'patch' | 'minor' | 'major' | 'prerelease' | 'custom',
 *   calculatedVersion?: string,
 *   customVersion?: string,
 *   prereleaseType?: 'alpha' | 'beta',
 *   prereleaseNumber?: number
 * }>} Object containing version information
 */
async function selectVersionType(majorVersion) {
  console.log(`Fetching latest tag for major version ${majorVersion}...`);

  const { success, nextPatch, nextMinor, nextMajor } = await getNextSemanticVersions(majorVersion);

  let nextPatchDisplay = nextPatch;
  let nextMinorDisplay = nextMinor;
  let nextMajorDisplay = nextMajor;

  if (!success) {
    // Use generic placeholders if no tags found
    nextPatchDisplay = 'x.x.X';
    nextMinorDisplay = 'x.X.0';
    nextMajorDisplay = 'X.0.0';
  }

  // Check if the selected major version is the latest one
  const currentMajorVersion = packageVersion.split('.')[0];
  const isLatestMajor = majorVersion === currentMajorVersion;

  // Check if current version is a prerelease (alpha or beta)
  const alphaMatch = packageVersion.match(/-alpha\.(\d+)$/);
  const betaMatch = packageVersion.match(/-beta\.(\d+)$/);
  const isAlpha = !!alphaMatch;
  const isBeta = !!betaMatch;
  const alphaVersion = isAlpha ? parseInt(alphaMatch[1], 10) : 0;
  const betaVersion = isBeta ? parseInt(betaMatch[1], 10) : 0;

  // Build choices array based on version type
  const choices = [
    { name: `Patch (${nextPatchDisplay})`, value: 'patch' },
    { name: `Minor (${nextMinorDisplay})`, value: 'minor' },
    { name: 'Custom version', value: 'custom' },
  ];

  // Handle prerelease options based on current version
  if (isLatestMajor) {
    if (isAlpha) {
      // If alpha is present, give option to increase alpha or start beta
      choices.splice(
        2,
        0,
        {
          name: `Increase Alpha (${currentMajorVersion}.0.0-alpha.${alphaVersion + 1})`,
          value: 'alpha-increase',
        },
        { name: `Start Beta (${currentMajorVersion}.0.0-beta.0)`, value: 'beta-start' },
      );
    } else if (isBeta) {
      // If beta is present, give option to increase beta or go to major
      choices.splice(
        2,
        0,
        {
          name: `Increase Beta (${currentMajorVersion}.0.0-beta.${betaVersion + 1})`,
          value: 'beta-increase',
        },
        { name: `Major (${nextMajorDisplay})`, value: 'major' },
      );
    } else {
      // If no prerelease, give option for major or start prerelease
      choices.splice(2, 0, {
        name: `Pre-Release (${nextMajorDisplay}-alpha.0)`,
        value: 'alpha-start',
      });
    }
  }

  // First prompt for version type
  const versionChoice = await select({
    message: 'Please select the version type:',
    default: 'patch',
    choices,
  });

  // Handle the selected version type
  switch (versionChoice) {
    case 'patch': {
      console.log(`Selected: Patch (${nextPatchDisplay})`);
      return {
        versionType: 'patch',
        calculatedVersion: nextPatch,
      };
    }
    case 'minor': {
      console.log(`Selected: Minor (${nextMinorDisplay})`);
      return {
        versionType: 'minor',
        calculatedVersion: nextMinor,
      };
    }
    case 'major': {
      console.log(`Selected: Major (${nextMajorDisplay})`);
      return {
        versionType: 'major',
        calculatedVersion: nextMajor,
      };
    }
    case 'custom': {
      let defaultCustomVersion;

      if (success && nextPatch) {
        // Use the calculated next patch version from tags
        defaultCustomVersion = nextPatch;
      } else {
        // If no tags were found, fall back to calculating from package.json
        const [defaultMajor, defaultMinor, defaultPatch] = packageVersion.split('.').map(Number);
        defaultCustomVersion = `${defaultMajor}.${defaultMinor}.${defaultPatch + 1}`;
      }

      const customVersion = await input({
        message: 'Enter custom version:',
        default: defaultCustomVersion,
      });

      console.log(`Selected: Custom version ${customVersion}`);
      return {
        versionType: 'custom',
        customVersion,
      };
    }
    case 'alpha-start': {
      const calculatedVersion = `${nextMajor}-alpha.0`;
      console.log(`Selected: Pre-Release (${calculatedVersion})`);
      return {
        versionType: 'prerelease',
        calculatedVersion,
        prereleaseType: 'alpha',
        prereleaseNumber: 0,
      };
    }
    case 'alpha-increase': {
      const calculatedVersion = `${currentMajorVersion}.0.0-alpha.${alphaVersion + 1}`;
      console.log(`Selected: Increase Alpha (${calculatedVersion})`);
      return {
        versionType: 'prerelease',
        calculatedVersion,
        prereleaseType: 'alpha',
        prereleaseNumber: alphaVersion + 1,
      };
    }
    case 'beta-start': {
      const calculatedVersion = `${currentMajorVersion}.0.0-beta.0`;
      console.log(`Selected: Start Beta (${calculatedVersion})`);
      return {
        versionType: 'prerelease',
        calculatedVersion,
        prereleaseType: 'beta',
        prereleaseNumber: 0,
      };
    }
    case 'beta-increase': {
      const calculatedVersion = `${currentMajorVersion}.0.0-beta.${betaVersion + 1}`;
      console.log(`Selected: Increase Beta (${calculatedVersion})`);
      return {
        versionType: 'prerelease',
        calculatedVersion,
        prereleaseType: 'beta',
        prereleaseNumber: betaVersion + 1,
      };
    }
    default:
      // This shouldn't happen with inquirer's list type
      throw new Error(`Unexpected version choice: ${versionChoice}`);
  }
}

/**
 * Calculate the new version based on the selected version type and parameters
 * @param {'patch' | 'minor' | 'major' | 'prerelease' | 'custom'} versionType - The selected version type
 * @param {string} [calculatedVersion] - The calculated version from git tags (if available)
 * @param {string} [customVersion] - The custom version entered by the user (if applicable)
 * @param {'alpha' | 'beta' | undefined} [prereleaseType] - The type of prerelease (for prerelease versions)
 * @param {number} [prereleaseNumber] - The prerelease version number (for prerelease versions)
 * @returns {string} The new version string in semver format (e.g., '9.0.0', '9.0.0-alpha.1', '9.0.0-beta.0')
 */
function calculateNewVersion(
  versionType,
  calculatedVersion,
  customVersion,
  prereleaseType,
  prereleaseNumber,
) {
  if (customVersion) {
    return customVersion;
  }

  if (calculatedVersion) {
    return calculatedVersion;
  }

  // Fall back to calculating from package.json if no calculated version is available
  const [major, minor, patch] = packageVersion.split('.').map(Number);

  if (versionType === 'patch') {
    return `${major}.${minor}.${patch + 1}`;
  }

  if (versionType === 'minor') {
    return `${major}.${minor + 1}.0`;
  }

  if (versionType === 'major') {
    return `${major + 1}.0.0`;
  }

  if (versionType === 'prerelease') {
    if (prereleaseType === 'alpha') {
      return `${major + 1}.0.0-alpha.${prereleaseNumber}`;
    }
    if (prereleaseType === 'beta') {
      return `${major}.0.0-beta.${prereleaseNumber}`;
    }
  }

  return packageVersion; // Fallback to current version if something goes wrong
}

/**
 * Check for uncommitted changes
 * @returns {Promise<void>}
 */
async function checkUncommittedChanges() {
  try {
    let { stdout } = await execa('git', ['status', '--porcelain']);
    if (!stdout) {
      return;
    }
    while (stdout) {
      console.warn('Warning: You have uncommitted changes.');
      console.warn('Please commit or stash your changes before continuing.');
      console.warn('You can run:');
      console.warn('  git add . && git commit -m "Your commit message"');
      console.warn('  or');
      console.warn('  git stash');
      console.warn('in another terminal window.');
      // eslint-disable-next-line no-await-in-loop
      await confirm({
        message: 'Press Enter to check again, or Ctrl+C to abort...',
        default: true,
      });
      // eslint-disable-next-line no-await-in-loop
      const result = await execa('git', ['status', '--porcelain']);
      stdout = result.stdout;
    }
  } catch (error) {
    console.error('Error checking for uncommitted changes:', error);
    process.exit(1);
  }
}

/**
 * Update the root package.json with the new version
 * @param {string} newVersion - The new version
 * @returns {Promise<void>}
 */
async function updatePackageJson(newVersion) {
  try {
    console.log('Updating root package.json...');

    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJsonContent = await fs.readFile(packageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent);

    packageJson.version = newVersion;

    await fs.writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);

    console.log(`Updated package.json version to ${newVersion}`);
  } catch (error) {
    console.error('Error updating package.json:', error);
    process.exit(1);
  }
}

/**
 * Generate the changelog
 * @param {string} newVersion - The new version
 * @param {string} lastVersion - The last version to compare against
 * @param {string} [releaseBranch='master'] - The branch to compare against (default is 'master')
 * @returns {Promise<string>} The changelog content
 */
async function generateChangelog(newVersion, lastVersion, releaseBranch = 'master') {
  try {
    console.log('Generating changelog...');

    console.log(`Using release branch: ${releaseBranch}`);
    console.log(`New version: ${newVersion}`);
    console.log(`Last version: ${lastVersion}`);

    return await generateChangelogFromModule({
      octokit,
      nextVersion: newVersion,
      lastRelease: `v${lastVersion}`,
      release: releaseBranch,
      returnEntry: true,
    });
  } catch (error) {
    console.error('Error generating changelog:', error);
    process.exit(1);
  }
}

/**
 * Add the new changelog entry to the CHANGELOG.md file
 * @param {string} changelogContent - The changelog content
 * @returns {Promise<void>}
 */
async function updateChangelog(changelogContent) {
  try {
    console.log('Adding changelog entry to CHANGELOG.md...');

    const changelogPath = path.join(process.cwd(), 'CHANGELOG.md');
    const changelogContent2 = await fs.readFile(changelogPath, 'utf8');

    // Find the position of the first version entry (currently ## 8.5.1)
    const lines = changelogContent2.split('\n');
    const firstVersionLineIndex = lines.findIndex((line) => /^## [0-9]/.test(line));

    if (firstVersionLineIndex === -1) {
      console.error(
        'Error updating changelog:',
        'Could not find the first version entry in CHANGELOG.md',
      );
      process.exit(1);
    }

    // Create a new changelog with the new content
    const newChangelog = [
      ...lines.slice(0, firstVersionLineIndex),
      `${changelogContent}\n`,
      ...lines.slice(firstVersionLineIndex),
    ].join('\n');

    await fs.writeFile(changelogPath, newChangelog);

    console.log('Changelog updated. Please review the changes.');
  } catch (error) {
    console.error('Error updating changelog:', error);
    process.exit(1);
  }
}

/**
 * Create the PR body with checklist
 * @param {string} newVersion - The new version
 * @returns {string} The PR body
 */
function createPrBody(newVersion) {
  return `Release version ${newVersion}

### Prepare the release of the packages

- [x] Compare the last tag with the branch upon which you want to release
- [x] Clean the generated changelog
- [x] Update the root package.json's version
- [x] Update the versions of the other package.json files
- [x] Open PR with changes and wait for review and green CI
- [ ] Once CI is green and you have enough approvals, send a message on the team-x slack channel announcing a merge freeze
- [ ] Merge PR

### Release the packages

- [ ] Checkout the last version of the working branch
- [ ] Run \`pnpm i && pnpm release:build\`
- [ ] Run \`pnpm release:publish\`
- [ ] Run \`pnpm release:tag\`

### Publish the documentation

- [ ] Run \`pnpm docs:deploy\`

### Publish GitHub release

- [ ] Create a new release on GitHub releases page

### Announce

- [ ] Follow the instructions in https://mui-org.notion.site/Releases-7490ef9581b4447ebdbf86b13164272d
`;
}

/**
 * Get all members of the mui/x team from GitHub
 * @param {string} [excludeUsername] - Username to exclude from the results (e.g., PR author)
 * @returns {Promise<string[]>} Array of GitHub usernames
 */
async function getTeamMembers(excludeUsername) {
  try {
    console.log('Fetching members of the mui/x team...');

    // Get team members
    const { data: teams } = await octokit.rest.teams.list({
      org: ORG,
    });

    // Find the x team
    const xTeam = teams.find((team) => team.name.toLowerCase() === 'x');

    if (!xTeam) {
      console.warn('Warning: Could not find the mui/x team.');
      return [];
    }

    // Get team members
    const { data: members } = await octokit.rest.teams.listMembersInOrg({
      org: ORG,
      team_slug: xTeam.slug,
    });

    let usernames = members.map((member) => member.login);

    // Filter out the excluded username if provided
    if (excludeUsername) {
      usernames = usernames.filter((username) => username !== excludeUsername);
      console.log(`Filtered out PR author (${excludeUsername}) from team members.`);
    }

    console.log(`Found ${usernames.length} members in the mui/x team.`);

    return usernames;
  } catch (error) {
    if (error.status === 403) {
      console.error(
        'Error: You do not have permission to access the mui/x team members.',
        'You need admin permissions on the repo to view teams and team members.',
        'Please add reviewers manually.',
      );
      return [];
    }
    console.error('Error fetching team members:', error.message);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Response data:', error.response.data);
    }
    return [];
  }
}

/**
 * Assign reviewers to a pull request
 * @param {number} prNumber - The PR number
 * @param {string[]} reviewers - Array of GitHub usernames to assign as reviewers
 * @returns {Promise<boolean>} Whether the operation was successful
 */
async function assignReviewers(prNumber, reviewers) {
  try {
    console.log(`Assigning ${reviewers.length} reviewers to PR #${prNumber}...`);

    // Assign reviewers
    await octokit.rest.pulls.requestReviewers({
      owner: ORG,
      repo: REPO,
      pull_number: prNumber,
      reviewers,
    });

    console.log('Reviewers assigned successfully.');
    return true;
  } catch (error) {
    console.error('Error assigning reviewers:', error.message);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

/**
 * Add labels to a pull request
 * @param {number} prNumber - The PR number
 * @param {string[]} labels - Array of label names to add to the PR
 * @returns {Promise<boolean>} Whether the operation was successful
 */
async function addLabelsToPR(prNumber, labels) {
  try {
    console.log(`Adding labels [${labels.join(', ')}] to PR #${prNumber}...`);

    // Add labels to the PR (PRs are treated as issues in the GitHub API)
    await octokit.rest.issues.addLabels({
      owner: ORG,
      repo: REPO,
      issue_number: prNumber,
      labels,
    });

    console.log('Labels added successfully.');
    return true;
  } catch (error) {
    console.error('Error adding labels:', error.message);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Response data:', error.response.data);
    }
    return false;
  }
}

/**
 * Create a pull request using Octokit
 * @param {string} title - The PR title
 * @param {string} body - The PR body
 * @param {string} head - The branch name
 * @param {string} base - The base branch
 * @returns {Promise<{
 *   url: string,
 *   number: number
 * }>} The URL and number of the created PR
 */
async function createPullRequest(title, body, head, base) {
  try {
    console.log('Creating PR using Octokit...');

    // Create the PR
    const { data } = await octokit.rest.pulls.create({
      owner: ORG,
      repo: REPO,
      title,
      body,
      head,
      base,
    });

    console.log(`PR created successfully: ${data.html_url}`);
    return { url: data.html_url, number: data.number };
  } catch (error) {
    console.error('Error creating PR with Octokit:', error.message);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Response data:', error.response.data);
    }
    throw error;
  }
}

/**
 * Main function
 */
async function main({ githubToken }) {
  try {
    // Check if we're in the repository root
    try {
      await Promise.all([
        fs.access(path.join(process.cwd(), 'package.json')),
        fs.access(path.join(process.cwd(), 'CHANGELOG.md')),
      ]);
    } catch (error) {
      console.error('Error: Please run this script from the repository root.');
      process.exit(1);
    }

    console.log('package.json and CHANGELOG.md found, proceeding...');
    console.log(`Current package version: ${packageVersion}`);

    // If no token is provided, throw an error
    if (!githubToken) {
      console.error(
        'Unable to authenticate. Make sure you either call the script with `--githubToken $token` or set `process.env.GITHUB_TOKEN`. The token needs `public_repo` permissions.',
      );
      process.exit(1);
    }

    octokit = new MyOctokit({
      auth: githubToken,
    });

    // Find the upstream remote
    const upstreamRemote = await findMuiXRemote();
    console.log(`Found upstream remote: ${upstreamRemote}`);

    // Find the fork remote
    const forkRemote = await findForkRemote();
    console.log(`Found fork remote: ${upstreamRemote}`);

    const latestMajorVersion = await findLatestMajorVersion();
    console.log(`Found latest major version: ${latestMajorVersion}`);

    // Initialize variables
    let versionType = '';
    let customVersion = '';
    let calculatedVersion = '';

    // Parse command line arguments
    if (argv.patch) {
      versionType = 'patch';
    } else if (argv.minor) {
      versionType = 'minor';
    } else if (argv.major) {
      versionType = 'major';
    } else if (argv.custom) {
      customVersion = argv.custom;
    }

    // Always prompt for major version first
    const majorVersion = await selectMajorVersion(latestMajorVersion);

    const previousVersion = await findLastVersionForMajor(majorVersion);
    console.log(`Latest tag for major version ${majorVersion}: ${previousVersion}`);

    // If no arguments provided, use interactive menu to select version type
    // Initialize prerelease variables (used for alpha/beta versions)
    let prereleaseType = '';
    let prereleaseNumber = 0;

    if (!versionType && !customVersion) {
      const result = await selectVersionType(previousVersion);
      versionType = result.versionType;
      calculatedVersion = result.calculatedVersion;
      customVersion = result.customVersion;
      prereleaseType = result.prereleaseType;
      prereleaseNumber = result.prereleaseNumber;
    } else {
      // Command-line arguments provided, calculate versions from tags
      const { success, nextPatch, nextMinor, nextMajor } =
        await getNextSemanticVersions(previousVersion);

      // If a version type was specified, set the calculated version
      if (versionType && success) {
        if (versionType === 'patch' && nextPatch) {
          calculatedVersion = nextPatch;
          console.log(`Using calculated patch version: ${calculatedVersion}`);
        } else if (versionType === 'minor' && nextMinor) {
          calculatedVersion = nextMinor;
          console.log(`Using calculated minor version: ${calculatedVersion}`);
        } else if (versionType === 'major' && nextMajor) {
          calculatedVersion = nextMajor;
          console.log(`Using calculated major version: ${calculatedVersion}`);
        }
      }
    }

    // Calculate new version
    const newVersion = calculateNewVersion(
      versionType,
      calculatedVersion,
      customVersion,
      prereleaseType,
      prereleaseNumber,
    );
    console.log(`New version: ${newVersion}`);

    // Determine which branch to update based on the selected major version
    if (majorVersion === latestMajorVersion) {
      console.log('Updating the upstream master branch for current major version...');
      await execa('git', ['fetch', upstreamRemote, 'master']);
    } else {
      console.log(`Updating the upstream v${majorVersion}.x branch...`);
      await execa('git', ['fetch', upstreamRemote, `v${majorVersion}.x`]);
    }

    // Create a new branch with the new version
    const branchName = `release/v${newVersion}-${new Date().toISOString().slice(0, 10)}`;
    console.log(`Creating new branch: ${branchName}`);

    // Check for uncommitted changes
    await checkUncommittedChanges();

    // Determine the source branch based on the selected major version
    let branchSource;
    if (majorVersion === latestMajorVersion) {
      branchSource = `${upstreamRemote}/master`;
      console.log(`Creating branch from master for current major version: ${branchSource}`);
    } else {
      branchSource = `${upstreamRemote}/v${majorVersion}.x`;
      console.log(`Creating branch from version branch: ${branchSource}`);
    }

    await execa('git', ['checkout', '-b', branchName, '--no-track', branchSource]);

    // Update package.json
    await updatePackageJson(newVersion);

    // Run lerna version script
    console.log('Running lerna version script...');
    await execa(
      'npx',
      [
        'lerna',
        'version',
        '--exact',
        '--no-changelog',
        '--no-push',
        '--no-git-tag-version',
        '--no-private',
      ],
      { stdio: 'inherit' },
    );

    console.log('Version update completed successfully!');
    console.log(`New version: ${newVersion}`);

    // Generate the changelog
    const changelogContent = await generateChangelog(
      newVersion,
      previousVersion,
      majorVersion === latestMajorVersion ? 'master' : `v${majorVersion}.x`,
    );

    // Add the new changelog entry to the CHANGELOG.md file
    await updateChangelog(changelogContent);

    // Wait for user confirmation
    await confirm({
      message: 'Press Enter to continue after reviewing the changes, or Ctrl+C to abort...',
      default: true,
    });

    // Commit the changes
    console.log('Committing changes...');
    await execa('git', ['add', 'package.json', 'CHANGELOG.md', 'packages/*/package.json']);
    await execa('git', ['commit', '-m', `[release] v${newVersion}`]);

    console.log(`Changes committed to branch ${branchName}`);

    // Push the committed changes to fork remote
    console.log('Pushing committed changes to fork remote...');
    try {
      await execa('git', ['push', forkRemote, branchName]);
      console.log(`Changes pushed to ${forkRemote}/${branchName}`);
    } catch (error) {
      console.error('Error pushing to fork remote:', error);
      console.error('Falling back to pushing to origin...');
      await execa('git', ['push', 'origin', branchName]);
      console.log(`Changes pushed to origin/${branchName}`);
    }

    // Create PR body with checklist
    const prBody = createPrBody(newVersion);

    // Open a PR
    console.log('Opening a PR...');
    try {
      // Determine the base branch based on the selected major version
      const baseBranch = majorVersion === latestMajorVersion ? 'master' : `v${majorVersion}.x`;

      // Get the origin owner (username or organization)
      const forkOwner = await findForkOwner();

      // Create the PR using Octokit
      const { url: prUrl, number: prNumber } = await createPullRequest(
        `[release] v${newVersion}`,
        prBody,
        `${forkOwner}:${branchName}`,
        baseBranch,
      );

      console.log(`PR created successfully: ${prUrl}`);

      // Step 1: Apply labels to the PR
      // Add 'release' label and a version label in the format 'v8.x'
      const versionLabel = `v${majorVersion}.x`;
      await addLabelsToPR(prNumber, ['release', versionLabel]);

      // Step 2: Get all members of the 'mui/x' team from GitHub (excluding the PR author)
      const teamMembers = await getTeamMembers(forkOwner);

      if (teamMembers.length > 0) {
        // Randomly select up to 15 team members as reviewers
        const shuffledMembers = [...teamMembers].sort(() => 0.5 - Math.random());
        const selectedReviewers = shuffledMembers.slice(0, Math.min(15, shuffledMembers.length));

        console.log(`Randomly selected ${selectedReviewers.length} team members as reviewers.`);

        // Assign the selected reviewers to the PR
        await assignReviewers(prNumber, selectedReviewers);
      }
    } catch (error) {
      console.error('Failed to create PR with Octokit or assign reviewers.');
      console.error(
        `You can manually create a PR with title: [release] v${newVersion} and label: release`,
      );
      console.error(`Branch: ${branchName}`);
      console.error('Use the following checklist in the PR body:');
      console.error(prBody);
    }

    console.log('Release preparation completed!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

yargs(hideBin(process.argv))
  .command({
    command: '$0',
    description: 'Prepares a release PR for MUI X',
    builder: (command) => {
      return command.option('githubToken', {
        default: process.env.GITHUB_TOKEN,
        describe:
          'The personal access token to use for authenticating with GitHub. Needs public_repo permissions.',
        type: 'string',
      });
    },
    handler: main,
  })
  .help()
  .strict(true)
  .version(false)
  .parse();
