import childProcess from 'child_process';

const [version = process.env.REACT_VERSION] = process.argv.slice(2);

if (typeof version !== 'string') {
  throw new TypeError(`expected version: string but got '${version}'`);
}

if (version !== 'stable') {
  // ensure the flag is set in `.npmrc` before calling `useReactVersion` from `@mui/monorepo`
  childProcess.execSync('pnpm config set auto-install-peers false --location project');
}

import('@mui/monorepo/scripts/useReactVersion.mjs');
