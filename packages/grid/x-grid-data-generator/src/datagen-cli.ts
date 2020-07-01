import { commodityColumns } from './commodities.columns';
import { employeeColumns } from './employees.columns';
import { getRealData } from './services';
import * as fs from 'fs';
import * as program from 'commander';

const loadData = async (size: number, dataset: string): Promise<any> => {
  const result = await getRealData(
    Number(size),
    dataset.toLowerCase() === 'commodity' ? commodityColumns : employeeColumns,
  );

  return result.rows;
};

export function datagenCli(args) {
  program
    .option('-d, --dataset <dataset>', 'A dataset can be "commodity" | "employee"', 'employee')
    .option('-s, --size <size>', 'The number of rows to generate', '100')
    .option(
      '-o, --output <output>',
      'The output file, if not passed, it will generate "./<dataset>-<size>.json"',
    )
    .option('-p, --pretty', 'print a prettier output', false)
    .action(function() {
      console.log(
        `Generating new ${program.dataset} dataset with ${Number(
          program.size,
        ).toLocaleString()} rows`,
      );
      loadData(Number(program.size), program.dataset).then(data => {
        const output = !program.output
          ? `./${program.dataset}-${program.size}.json`
          : program.output;
        console.log(`Saving generated dataset in ${output}`);
        fs.writeFileSync(output, JSON.stringify(data, null, program.pretty ? 2 : undefined));
      });
    })
    .parse(args);
}
