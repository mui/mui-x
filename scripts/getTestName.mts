import { readFileSync } from 'node:fs';

export const getTestName = (url: string): string => {
  const name = [];

  if (url.includes('.browser.mts')) {
    if (process.env.BROWSER !== 'true') {
      name.push('browser');
    }
  } else if (url.includes('.jsdom.mts')) {
    if (process.env.JSDOM !== 'true') {
      name.push('jsdom');
    }
  }

  const packageJson = readFileSync(new URL('./package.json', url), 'utf-8');

  const packageJsonParsed = JSON.parse(packageJson);
  const packageName = packageJsonParsed.name.split('/')[1] ?? packageJsonParsed.name;
  name.push(packageName);

  return name.join('/');
};
