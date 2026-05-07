import path from 'path';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { buildApi } from '@mui/internal-api-docs-builder';
import { projectSettings } from './projectSettings';

type CommandOptions = { grep?: string; project?: string };

const getProjectName = (settings: (typeof projectSettings)[number]) =>
  path.basename(settings.translationPagesDirectory);

async function run(argv: yargs.ArgumentsCamelCase<CommandOptions>) {
  const grep = argv.grep == null ? null : new RegExp(argv.grep);

  let settings = projectSettings;
  if (argv.project) {
    settings = projectSettings.filter((s) => getProjectName(s) === argv.project);
    if (settings.length === 0) {
      const available = projectSettings.map(getProjectName).join(', ');
      throw new Error(
        `MUI X: Unknown project "${argv.project}". Available projects: ${available}.`,
      );
    }
  }

  return buildApi(settings, grep);
}

yargs(hideBin(process.argv))
  .command({
    command: '$0',
    describe: 'Generates API documentation for the MUI packages.',
    builder: (command) => {
      return command
        .option('grep', {
          description:
            'Only generate files for component filenames matching the pattern. The string is treated as a RegExp.',
          type: 'string',
        })
        .option('project', {
          description:
            'Only generate API docs for the given project (e.g. "charts", "data-grid", "date-pickers", "tree-view", "scheduler", "chat").',
          type: 'string',
        });
    },
    handler: run,
  })
  .help()
  .strict(true)
  .version(false)
  .parse();
