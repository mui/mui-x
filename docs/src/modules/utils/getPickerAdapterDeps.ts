import fs from 'node:fs';
import path from 'node:path';

const ADAPTER_LIBS = [
  'date-fns',
  'date-fns-jalali',
  'dayjs',
  'luxon',
  'moment',
  'moment-hijri',
  'moment-jalaali',
];

export function getPickerAdapterDeps() {
  const datePickersDir = path.resolve(__dirname, '../../../../packages/x-date-pickers');
  return ADAPTER_LIBS.reduce(
    (result, libraryName) => {
      const packageJsonPath = require.resolve(`${libraryName}/package.json`, {
        paths: [datePickersDir],
      });
      const { version } = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      result[libraryName] = version;
      return result;
    },
    {} as Record<string, string>,
  );
}
