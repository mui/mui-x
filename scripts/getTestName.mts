import { readFileSync } from 'node:fs';

export const getTestName = (url: string): string => {
  const packageJson = readFileSync(new URL('./package.json', url), 'utf-8');

  const packageJsonParsed = JSON.parse(packageJson);
  const packageName = packageJsonParsed.name.split('/')[1] ?? packageJsonParsed.name;

  return packageName;
};
