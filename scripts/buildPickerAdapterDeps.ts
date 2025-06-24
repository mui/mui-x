import childProcess from 'node:child_process';
import path from 'node:path';
import * as fse from 'fs-extra';

interface ListedDependency {
  name: string;
  devDependencies?: {
    [key: string]: {
      version: string;
    };
  };
}

const adapterLibs = childProcess.execSync(
  'pnpm list date-fns date-fns-jalali dayjs luxon moment moment-hijri moment-jalaali --json',
  { cwd: path.resolve(__dirname, '../packages/x-date-pickers') },
);
const jsonListedDependencies: ListedDependency[] = JSON.parse(adapterLibs.toString());
const adapterDependencyMap = Object.entries(jsonListedDependencies[0].devDependencies).reduce(
  (result, [libraryName, libraryInfo]) => {
    result[libraryName] = libraryInfo.version;
    return result;
  },
  {},
);
try {
  fse.writeJSON(
    path.resolve(__dirname, '../docs/src/modules/utils/adapter-dependencies.json'),
    adapterDependencyMap,
    { encoding: 'utf8' },
  );
} catch (error) {
  console.error('Error writing adapter dependencies:', error);
  process.exit(1);
}
