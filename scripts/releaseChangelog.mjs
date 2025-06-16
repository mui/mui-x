/* eslint-disable no-restricted-syntax */
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
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { generateChangelog } from './changelogUtils.mjs';

/**
 * Main function for the CLI
 * @param {Object} argv - The command line arguments
 * @returns {Promise<string|null>} The changelog string or null
 */
async function main(argv) {
  return generateChangelog(argv);
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
          // #target-branch-reference
          // to be done when we branch off for a new major (e.g. v9)
          default: 'master',
          describe: 'Ref which we want to release',
          type: 'string',
        })
        .option('nextVersion', {
          describe:
            'The version expected to be released e.g. `5.2.0`. Replaces `__VERSION__` placeholder in the changelog.',
          type: 'string',
        })
        .option('returnEntry', {
          describe: 'Return the changelog string instead of logging it to the console.',
          type: 'boolean',
          default: false,
        });
    },
    handler: main,
  })
  .help()
  .strict(true)
  .version(false)
  .parse();
