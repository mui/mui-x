/* eslint-disable no-console */
import * as fs from 'fs';
import * as yargs from 'yargs';
import { getCommodityColumns } from './commodities.columns';
import { getEmployeeColumns } from './employees.columns';
import { getRealGridData } from './services';

const loadData = async (size: number, dataset: string): Promise<any> => {
  const result = await getRealGridData(
    Number(size),
    dataset.toLowerCase() === 'commodity' ? getCommodityColumns() : getEmployeeColumns(),
  );

  return result.rows;
};

interface HandlerArgv {
  dataset: string;
  output: string;
  pretty: boolean;
  size: string;
}

export function datagenCli() {
  yargs
    .command({
      command: '$0',
      describe: 'Generates Component.propTypes from TypeScript declarations',
      builder: (command) => {
        return command
          .option('dataset', {
            default: '',
            describe: 'A dataset can be "commodity" | "employee"',
            type: 'string',
          })
          .option('output', {
            default: '',
            describe: 'The output file, if not passed, it will generate "./<dataset>-<size>.json"',
            type: 'string',
          })
          .option('pretty', {
            default: false,
            describe: 'Print a prettier output',
            type: 'boolean',
          })
          .option('size', {
            default: '1000',
            describe: 'The number of rows to generate',
            type: 'string',
          });
      },
      handler: (argv: HandlerArgv) => {
        console.log(
          `Generating new ${argv.dataset} dataset with ${Number(argv.size).toLocaleString()} rows`,
        );
        loadData(Number(argv.size), argv.dataset).then((data) => {
          const output = !argv.output ? `./${argv.dataset}-${argv.size}.json` : argv.output;
          console.log(`Saving generated dataset in ${output}`);
          fs.writeFileSync(output, JSON.stringify(data, null, argv.pretty ? 2 : undefined));
        });
      },
    })
    .help()
    .strict(true)
    .version(false)
    .parse();
}
