import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { ProjectSettings, buildApi } from '@mui-internal/api-docs-builder';
import { projectPickersSettings } from './pickersSettings';
import { projectChartsSettings } from './chartsSettings';
import { projectGridSettings } from './gridSettings';
import { projectTreeSettings } from './treeViewSettings';

const projectSettings: ProjectSettings[] = [
  projectPickersSettings,
  projectChartsSettings,
  projectTreeSettings,
  projectGridSettings,
];

type CommandOptions = { grep?: string };

async function run(argv: yargs.ArgumentsCamelCase<CommandOptions>) {
  const grep = argv.grep == null ? null : new RegExp(argv.grep);
  return buildApi(projectSettings, grep);
}

yargs(hideBin(process.argv))
  .command({
    command: '$0',
    describe: 'Generates API documentation for the MUI packages.',
    builder: (command) => {
      return command.option('grep', {
        description:
          'Only generate files for component filenames matching the pattern. The string is treated as a RegExp.',
        type: 'string',
      });
    },
    handler: run,
  })
  .help()
  .strict(true)
  .version(false)
  .parse();
