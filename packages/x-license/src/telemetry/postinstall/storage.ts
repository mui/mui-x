import { randomBytes } from 'crypto';
import fs from 'fs';
import os from 'os';
import path from 'path';
import notifyAboutMuiXTelemetry from './notify';
import getEnvironmentInfo from './get-environment-info';

// This is the key that specifies when the user was informed about telemetry collection.
const TELEMETRY_KEY_NOTIFY_DATE = 'telemetry.notifiedAt';

// This is a quasi-persistent identifier used to dedupe recurring events. It's
// generated from random data and completely anonymous.
const TELEMETRY_KEY_ID = `telemetry.anonymousId`;

const CONFIG_FILE_NAME = 'config.json';
const PROJECT_NAME = 'mui-x';

function getConfigDirectory(distDir: string): string {
  const env = getEnvironmentInfo();
  const isLikelyEphemeral = env.isCI || env.isDocker;

  if (isLikelyEphemeral) {
    return path.join(distDir, 'cache', PROJECT_NAME);
  }

  const { platform } = process;
  const homedir = os.homedir();

  if (platform === 'darwin') {
    return path.join(homedir, 'Library', 'Preferences', PROJECT_NAME);
  }
  if (platform === 'win32') {
    const appData = process.env.APPDATA || path.join(homedir, 'AppData', 'Roaming');
    return path.join(appData, PROJECT_NAME, 'Config');
  }
  // Linux / others: follow XDG Base Directory specification
  const xdgConfig = process.env.XDG_CONFIG_HOME || path.join(homedir, '.config');
  return path.join(xdgConfig, PROJECT_NAME);
}

type ConfigData = Record<string, unknown>;

function readConfigFile(configPath: string): ConfigData {
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  } catch {
    return {};
  }
}

function writeConfigFile(configPath: string, data: ConfigData): void {
  const dir = path.dirname(configPath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(configPath, JSON.stringify(data, null, '\t'));
}

export class TelemetryStorage {
  private readonly configPath: string | null;

  public static async init({ distDir }: { distDir: string }) {
    const configDirectory = getConfigDirectory(distDir);
    let configFilePath: string | null = null;
    try {
      configFilePath = path.join(configDirectory, CONFIG_FILE_NAME);
      // Verify write access by ensuring the directory exists
      fs.mkdirSync(configDirectory, { recursive: true });
    } catch {
      configFilePath = null;
    }

    return new TelemetryStorage(configFilePath);
  }

  private constructor(filePath: string | null) {
    this.configPath = filePath;
    this.notify();
  }

  private notify = () => {
    if (!this.configPath) {
      return;
    }

    // The end-user has already been notified about our telemetry integration. We
    // don't need to constantly annoy them about it.
    // We will re-inform users about the telemetry if significant changes are
    // ever made.
    const data = readConfigFile(this.configPath);
    if (data[TELEMETRY_KEY_NOTIFY_DATE]) {
      return;
    }
    data[TELEMETRY_KEY_NOTIFY_DATE] = Date.now().toString();
    writeConfigFile(this.configPath, data);

    notifyAboutMuiXTelemetry();
  };

  get anonymousId(): string {
    if (this.configPath) {
      const data = readConfigFile(this.configPath);
      const existing = data[TELEMETRY_KEY_ID];
      if (typeof existing === 'string') {
        return existing;
      }

      const generated = randomBytes(32).toString('hex');
      data[TELEMETRY_KEY_ID] = generated;
      writeConfigFile(this.configPath, data);
      return generated;
    }

    return randomBytes(32).toString('hex');
  }
}
