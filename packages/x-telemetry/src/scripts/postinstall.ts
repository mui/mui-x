import fs from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';
import type { TelemetryContextType } from '../context';
import getAnonymousEnvironment from '../internal/get-anonymous-environment';
import getAnonymousProjectId from '../internal/get-project-id';
// eslint-disable-next-line import/no-cycle
import { TelemetryStorage } from '../internal/storage';
import getAnonymousMachineId from '../internal/get-machine-id';

(async () => {
  const storage = new TelemetryStorage({
    distDir: path.join(process.cwd()),
  });

  const [anonymousEnvironment, projectId, machineId] = await Promise.all([
    getAnonymousEnvironment(),
    getAnonymousProjectId(),
    getAnonymousMachineId(),
  ]);

  const contextData: TelemetryContextType = {
    config: {
      isCollecting: storage.isCollecting,
      isInitialized: true,
    },
    traits: {
      ...anonymousEnvironment,
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
    (content) => `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = void 0;
var _default = exports.default = ${content};`,
  );
})().catch((error) => {
  console.error(
    '[telemetry] Failed to make initialization. Please, report error to MUI X team:\n' +
      'https://support.mui.com/hc/en-us/requests/new?tf_360023797420=mui_x\n',
    error,
  );
});
