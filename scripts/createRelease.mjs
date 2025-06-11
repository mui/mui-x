#!/usr/bin/env node
/**
 * MUI-X Release Script
 *
 * This script automates the release process for MUI-X by:
 * 1. Updating the upstream master branch
 * 2. Creating a new branch with the new release version (e.g. release/v8.5.2)
 * 3. Updating the root package.json with a new version based on user input
 * 4. Running the release:version script
 * 5. Generating a changelog and inserting it into CHANGELOG.md
 * 6. Opening a PR with the checklist from README.md
 *
 * Usage:
 * 1. Make the script executable: chmod +x scripts/createRelease.mjs
 * 2. Run the script with options:
 *    ./scripts/createRelease.mjs --version-type patch
 *    ./scripts/createRelease.mjs --custom-version 8.5.2
 *    ./scripts/createRelease.mjs --github-token <token>
 *
 * Requirements:
 * - Git access to the mui/mui-x repository
 * - GitHub token with "public_repo" permission (for changelog generation)
 * - GitHub CLI (optional, for automatic PR creation)
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// Execute shell command and return output
function exec(command) {
  console.log(`Executing: ${command}`);
  try {
    return execSync(command, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'inherit'] });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

// Find the remote pointing to mui/mui-x
function findMuiXRemote() {
  const remotes = exec('git remote -v').trim().split('\n');

  for (const remote of remotes) {
    const [name, url, method] = remote.split(/\s+/);
    if (/mui\/mui-x(\.git)?$/.test(url) && method === '(push)') {
      return name;
    }
  }

  throw new Error(
    'Unable to find the upstream remote. It should be a remote pointing to "mui/mui-x". ' +
      'Did you forget to add it via `git remote add upstream git@github.com:mui/mui-x.git`?',
  );
}

// Get the PR checklist from README.md
function getPRChecklist() {
  const readmePath = path.join(process.cwd(), 'scripts', 'README.md');
  const readme = fs.readFileSync(readmePath, 'utf8');

  // Extract the checklist section
  const checklistMatch = readme.match(/### Release PR checklist\s+```markdown([\s\S]+?)```/);
  if (!checklistMatch || !checklistMatch[1]) {
    throw new Error('Could not find the PR checklist in scripts/README.md');
  }

  return checklistMatch[1].trim();
}

// Update package.json with new version
function updatePackageJson(version) {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  packageJson.version = version;

  fs.writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
  console.log(`Updated package.json version to ${version}`);
}

// Insert changelog at the beginning of CHANGELOG.md
function insertChangelog(changelog) {
  const changelogPath = path.join(process.cwd(), 'CHANGELOG.md');
  const existingChangelog = fs.readFileSync(changelogPath, 'utf8');

  // Find the position after the header (first few lines)
  const headerEndPos = existingChangelog.indexOf('## ');
  if (headerEndPos === -1) {
    throw new Error('Could not find the beginning of the first release section in CHANGELOG.md');
  }

  // Clean up the changelog - remove any extra lines at the beginning or end
  const cleanChangelog = changelog.trim();

  // Insert the new changelog after the header
  const newChangelog = `${
    existingChangelog.substring(0, headerEndPos) + cleanChangelog
  }\n\n${existingChangelog.substring(headerEndPos)}`;

  fs.writeFileSync(changelogPath, newChangelog);
  console.log('Inserted new changelog into CHANGELOG.md');
}

// Main function
async function main() {
  try {
    // Parse command line arguments
    const argv = yargs(hideBin(process.argv))
      .usage('Usage: $0 [options]')
      .option('version-type', {
        describe: 'Type of version update',
        type: 'string',
        choices: ['patch', 'minor', 'major'],
        conflicts: 'custom-version',
      })
      .option('custom-version', {
        describe: 'Custom version number (e.g., 8.5.2)',
        type: 'string',
        conflicts: 'version-type',
      })
      .option('github-token', {
        describe: 'GitHub token with "public_repo" permission',
        type: 'string',
      })
      .option('skip-confirmation', {
        describe: 'Skip confirmation prompts',
        type: 'boolean',
        default: false,
      })
      .example('$0 --version-type patch', 'Create a patch release')
      .example('$0 --custom-version 8.5.2', 'Create a release with a specific version')
      .example('$0 --github-token <token>', 'Use a specific GitHub token')
      .help()
      .alias('help', 'h')
      .version(false)
      .parse();

    console.log('=== MUI-X Release Script ===');
    console.log('This script will help you prepare a new release for MUI-X.');
    console.log(
      'It will create a new branch, update versions, generate a changelog, and prepare for a PR.',
    );
    console.log('Make sure you have the latest master branch before running this script.\n');

    // Check if we're in the repository root
    if (
      !fs.existsSync(path.join(process.cwd(), 'package.json')) ||
      !fs.existsSync(path.join(process.cwd(), 'CHANGELOG.md'))
    ) {
      throw new Error('Please run this script from the repository root.');
    }

    // 1. Find the upstream remote
    const upstreamRemote = findMuiXRemote();
    console.log(`Found upstream remote: ${upstreamRemote}`);

    // 2. Update the upstream master branch
    exec(`git fetch ${upstreamRemote} master`);

    // Check for uncommitted changes
    const status = exec('git status --porcelain');
    if (status.trim() !== '') {
      throw new Error(
        'You have uncommitted changes. Please commit or stash them before running this script.',
      );
    }

    // 3. Determine the new version
    let newVersion;

    // Get current version from package.json
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const currentVersion = packageJson.version;

    if (argv.customVersion) {
      newVersion = argv.customVersion;
    } else if (argv.versionType) {
      // Calculate new version based on version type
      const [major, minor, patch] = currentVersion.split('.').map(Number);

      if (argv.versionType === 'patch') {
        newVersion = `${major}.${minor}.${patch + 1}`;
      } else if (argv.versionType === 'minor') {
        newVersion = `${major}.${minor + 1}.0`;
      } else if (argv.versionType === 'major') {
        newVersion = `${major + 1}.0.0`;
      }
    } else {
      // If no version options provided, show current version and exit
      console.log(`Current version: ${currentVersion}`);
      console.log('Please specify --version-type or --custom-version');
      process.exit(1);
    }

    console.log(`Creating new release with version: ${newVersion}`);

    // 4. Create a new branch with the new release version
    const branchName = `release/v${newVersion}`;
    exec(`git checkout -b ${branchName} ${upstreamRemote}/master`);
    console.log(`Created new branch: ${branchName}`);

    // 5. Update the root package.json with the new version
    updatePackageJson(newVersion);

    // 6. Run the release:version script
    exec('lerna version --exact --no-changelog --no-push --no-git-tag-version --no-private');

    return;
    // 7. Generate a changelog
    console.log('\nGenerating changelog...');
    console.log('This may take a moment as it fetches data from GitHub...');

    // Use GitHub token from command line or environment variable
    let changelogCmd = `pnpm release:changelog --nextVersion ${newVersion}`;
    if (argv.githubToken) {
      changelogCmd += ` --githubToken ${argv.githubToken}`;
    }

    const changelog = exec(changelogCmd);

    // 8. Insert the changelog into CHANGELOG.md
    console.log('\nInserting changelog into CHANGELOG.md...');
    console.log('Please review and edit the changelog to add highlights and clean up any issues.');
    insertChangelog(changelog);

    // Pause to let the user review and edit the changelog if not skipping confirmation
    if (!argv.skipConfirmation) {
      console.log('\nPlease review the changelog in CHANGELOG.md and make any necessary edits.');
      console.log('Press Ctrl+C to abort or Enter to continue...');
      await new Promise((resolve) => {
        process.stdin.once('data', () => {
          resolve();
        });
      });
    }

    // 9. Commit the changes
    exec('git add .');
    exec(`git commit -m "Release v${newVersion}"`);

    // 10. Push the branch to the remote
    exec(`git push -u ${upstreamRemote} ${branchName}`);

    // 11. Prepare PR information
    const prTitle = `[release] v${newVersion}`;
    const prBody = getPRChecklist();

    // Try to open the PR automatically if gh CLI is installed
    let prUrl = '';
    exec(`git push -u origin ${branchName}`);
    try {
      console.log('\nAttempting to create PR using GitHub CLI...');
      // Check if gh is installed
      exec('gh --version');

      // Create the PR
      const prOutput = exec(
        `gh pr create --title "${prTitle}" --body "${prBody}" --repo mui/mui-x --base master --head ${branchName}`,
      );

      // Extract PR URL from output
      const urlMatch = prOutput.match(/(https:\/\/github\.com\/mui\/mui-x\/pull\/\d+)/);
      if (urlMatch && urlMatch[1]) {
        prUrl = urlMatch[1];
        console.log(`PR created successfully: ${prUrl}`);
      }
    } catch (error) {
      console.log(
        'Could not create PR automatically. GitHub CLI may not be installed or configured.',
      );
      prUrl = `https://github.com/mui/mui-x/compare/master...${branchName}`;
    }

    console.log('\n===================================');
    console.log('Release preparation completed!');
    console.log('===================================');
    console.log(`Branch: ${branchName}`);
    console.log(`Version: ${newVersion}`);

    if (!prUrl.startsWith('https://github.com/mui/mui-x/pull/')) {
      console.log('\nPlease create a PR with the following:');
      console.log(`Title: ${prTitle}`);
      console.log('Body:');
      console.log(prBody);
      console.log('\nYou can create the PR at:');
      console.log(prUrl);
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
