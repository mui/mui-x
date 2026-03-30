import fs from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';
import { fileURLToPath } from 'url';
import type { TelemetryContextType } from '../context';
import getEnvironmentInfo from './get-environment-info';
import getAnonymousProjectId, {
  getAnonymousRepoId,
  getAnonymousPackageName,
  getAnonymousRootPathId,
} from './get-project-id';
import getAnonymousMachineId from './get-machine-id';
import { TelemetryStorage } from './storage';

// It's a flat build, both CJS and ESM files live in the same directory.
// postinstall/index.mjs is at <pkg-root>/postinstall/index.mjs,
// so we go up one level to reach the package root.
const dirname =
  typeof __dirname === 'string' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

(async () => {
  // If Node.js support permissions, we need to check if the current user has
  // the necessary permissions to write to the file system.
  if (
    typeof process.permission !== 'undefined' &&
    !(process.permission.has('fs.read') && process.permission.has('fs.write'))
  ) {
    return;
  }

  const storage = await TelemetryStorage.init({
    distDir: process.cwd(),
  });

  const [environmentInfo, projectId, repoHash, packageNameHash, rootPathHash, machineId] =
    await Promise.all([
      getEnvironmentInfo(),
      getAnonymousProjectId(),
      getAnonymousRepoId(),
      getAnonymousPackageName(),
      getAnonymousRootPathId(),
      getAnonymousMachineId(),
    ]);

  const contextData: TelemetryContextType = {
    config: {
      isInitialized: true,
    },
    traits: {
      ...environmentInfo,
      machineId,
      repoHash,
      packageNameHash,
      rootPathHash,
      projectId,
      sessionId: randomBytes(32).toString('hex'),
      anonymousId: storage.anonymousId,
    },
  };

  const packageRoot = path.resolve(dirname, '..');
  const content = JSON.stringify(contextData, null, 2);

  // ESM: context.mjs
  fs.writeFileSync(path.resolve(packageRoot, 'context.mjs'), `export default ${content};`);

  // CJS: context.js
  fs.writeFileSync(
    path.resolve(packageRoot, 'context.js'),
    [
      `"use strict";`,
      `Object.defineProperty(exports, "__esModule", { value: true });`,
      `exports.default = void 0;`,
      `var _default = exports.default = ${content};`,
    ].join('\n'),
  );
})().catch((error) => {
  console.error(
    '[telemetry] Failed to make initialization. Please, report error to MUI X team:\n' +
      'https://mui.com/r/x-telemetry-postinstall-troubleshoot\n',
    error,
  );
});
