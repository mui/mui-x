import { randomBytes } from 'crypto';
import path from 'path';
import Conf from 'conf';
import isDockerFunction from 'is-docker';
import ciEnvironment from 'ci-info';
import notifyAboutMuiXTelemetry from './notify';

// This is the key that specifies when the user was informed about telemetry collection.
const TELEMETRY_KEY_NOTIFY_DATE = 'telemetry.notifiedAt';

// This is a quasi-persistent identifier used to dedupe recurring events. It's
// generated from random data and completely anonymous.
const TELEMETRY_KEY_ID = `telemetry.anonymousId`;

function getStorageDirectory(distDir: string): string | undefined {
  const isLikelyEphemeral = ciEnvironment.isCI || isDockerFunction();

  if (isLikelyEphemeral) {
    return path.join(distDir, 'cache');
  }

  return undefined;
}

export class TelemetryStorage {
  private readonly conf: Conf<any> | null;

  constructor({ distDir }: { distDir: string }) {
    const storageDirectory = getStorageDirectory(distDir);

    try {
      // `conf` incorrectly throws a permission error during initialization
      // instead of waiting for first use. We need to handle it, otherwise the
      // process may crash.
      this.conf = new Conf({ projectName: 'mui-x', cwd: storageDirectory });
    } catch (_) {
      this.conf = null;
    }
    this.notify();
  }

  private notify = () => {
    if (!this.conf) {
      return;
    }

    // The end-user has already been notified about our telemetry integration. We
    // don't need to constantly annoy them about it.
    // We will re-inform users about the telemetry if significant changes are
    // ever made.
    if (this.conf.get(TELEMETRY_KEY_NOTIFY_DATE, '')) {
      return;
    }
    this.conf.set(TELEMETRY_KEY_NOTIFY_DATE, Date.now().toString());

    notifyAboutMuiXTelemetry();
  };

  get configPath(): string | undefined {
    return this.conf?.path;
  }

  get anonymousId(): string {
    const val = this.conf && this.conf.get(TELEMETRY_KEY_ID);
    if (val) {
      return val;
    }

    const generated = randomBytes(32).toString('hex');
    this.conf?.set(TELEMETRY_KEY_ID, generated);
    return generated;
  }
}
