#!/usr/bin/env node
/**
 * This script generates a changelog for MUI X packages.
 *
 * Features:
 * - Fetches commits between two Git references (tags/branches)
 * - Categorizes commits based on tags in commit messages and PR labels
 * - Generates a changelog with sections for different packages
 * - Uses actual versions from package.json files
 * - Can return the changelog as a string when --returnEntry is passed
 */
import { retry } from '@octokit/plugin-retry';
import { Octokit } from '@octokit/rest';
import readline from 'node:readline/promises';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { getChangelogUtils } from './changelogUtils.mjs';

/**
 * Create a custom Octokit class with retry functionality
 * @type {typeof import('@octokit/rest').Octokit}
 */
const MyOctokit = Octokit.plugin(retry);

/**
 * Main function for the CLI
 * @param {object} argv - The command line arguments
 * @param {string} [argv.release] - Ref which we want to release
 * @param {string} [argv.lastRelease] - The release to compare against
 * @param {string} [argv.nextVersion] - The version expected to be released
 * @param {string} [argv.githubToken] - GitHub token for authentication
 * @returns {Promise<string|null>} The changelog string or null
 */
async function main(argv) {
  const { githubToken, ...other } = argv;

  // Temporary code till everyone removes usage of GITHUB_TOKEN
  /**
   * @type {import('@octokit/rest').Octokit | undefined}
   */
  let octokit;
  if (githubToken || process.env.GITHUB_TOKEN) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    const startMessage = githubToken
      ? `You have provided a GitHub token via --githubToken. It is not recommended to pass it now since we will deprecate this flag in the future.`
      : 'Found a value in "GITHUB_TOKEN" environment variable.\nIt is not recommended to use it and you should remove it\nfrom your shell rc file (.bashrc/.zshrc etc) if set there.';
    const answer = (await rl.question(`${startMessage}\nDo you still want to use it? (y/N): `))
      .trim()
      .toLowerCase();
    rl.close();
    if (answer === 'y') {
      // eslint-disable-next-line no-console
      console.log('\n\n');
      octokit = new MyOctokit({ auth: githubToken || process.env.GITHUB_TOKEN });
    }
  }

  const { generateChangelog } = getChangelogUtils(octokit);

  return generateChangelog({ ...other, octokit });
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
          describe:
            'The personal access token to use for authenticating with GitHub. Needs public_repo permissions.',
          type: 'string',
        })
        .option('release', {
          // #target-branch-reference
          // to be done when we branch off for a new major (e.g. v9)
          default: 'v8.x',
          describe: 'Ref which we want to release',
          type: 'string',
        })
        .option('nextVersion', {
          describe:
            'The version expected to be released e.g. `5.2.0`. Replaces `__VERSION__` placeholder in the changelog.',
          type: 'string',
        });
    },
    handler: main,
  })
  .help()
  .strict(true)
  .version(false)
  .parse();
