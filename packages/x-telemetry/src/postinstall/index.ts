import fs from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';
import type { TelemetryContextType } from '../context';
import getEnvironmentInfo from './get-environment-info';
import getAnonymousProjectId from './get-project-id';
import getAnonymousMachineId from './get-machine-id';
import { TelemetryStorage } from './storage';

(async () => {
  const storage = new TelemetryStorage({
    distDir: path.join(process.cwd()),
  });

  const [environmentInfo, projectId, machineId] = await Promise.all([
    getEnvironmentInfo(),
    getAnonymousProjectId(),
    getAnonymousMachineId(),
  ]);

  const contextData: TelemetryContextType = {
    config: {
      isCollecting: storage.isCollecting,
      isInitialized: true,
    },
    traits: {
      ...environmentInfo,
      machineId,
      projectId,
      sessionId: randomBytes(32).toString('hex'),
      anonymousId: storage.anonymousId,
    },
  };

  const writeContextData = (filePath: string, format: (content: string) => string) => {
    const targetPath = path.resolve(__dirname, '..', filePath, 'context.js');
    fs.writeFileSync(targetPath, format(JSON.stringify(contextData, null, 2)));
  };

  writeContextData('modern', (content) => `export default ${content};`);
  writeContextData('esm', (content) => `export default ${content};`);
  writeContextData(
    '',
    (content) => [
      `"use strict";`,
      `Object.defineProperty(exports, "__esModule", { value: true });`,
      `exports.default = void 0;`,
      `var _default = exports.default = ${content};`
    ].join('\n'),
  );
})().catch((error) => {
  console.error(
    '[telemetry] Failed to make initialization. Please, report error to MUI X team:\n' +
      'https://github.com/mui/mui-x/issues/new/choose\n',
    error,
  );
});
