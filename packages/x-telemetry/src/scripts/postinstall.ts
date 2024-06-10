/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';
import { TelemetryStorage } from "../storage";
import { getAnonymousMeta } from '../anonymous-meta';

(async () => {
    const storage =  new TelemetryStorage({
        distDir: path.join(process.cwd())
    })

    const contextData = {
        isTelemetryDisabled: storage.isDisabled,
        traits: {
            anonymousId: storage.anonymousId,
            projectId: await storage.getProjectId(),
            machineId: await storage.getMachineId(),
            sessionId: randomBytes(32).toString('hex'),
            ...getAnonymousMeta(),
        }
    }

    const writeContextData = (filePath: string, format: (content: string) => string) => {
        const targetPath = path.resolve(__dirname, '..', filePath, 'context.js')
        fs.writeFileSync(targetPath, format(JSON.stringify(contextData, null, 2)))
    }

    writeContextData('modern', (content) => `export default ${content};`)
    writeContextData('esm', (content) => `export default ${content};`)
    writeContextData('', (content) => `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = void 0;
var _default = exports.default = ${content};`)
})().catch((error) => (
    console.error(`[telemetry] Failed to write context data. Skipping.`, error)
));
