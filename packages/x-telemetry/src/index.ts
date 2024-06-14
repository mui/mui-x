/* eslint-disable no-underscore-dangle */

import { ponyfillGlobal } from '@mui/utils';
import { getMuiXTelemetryEnv, setMuiXTelemetryEnv } from './env';
import telemetryContext from './context';

interface TelemetryEvent {
  eventName: string;
  payload: any;
}

function getLicenseKey(): string | undefined {
  return ponyfillGlobal.__MUI_LICENSE_INFO__?.key || undefined;
}

function shouldSendTelemetry(): boolean {
  // Temporarily disable collection of the telemetry
  // in non-production environment
  if (process.env.NODE_ENV === 'production') {
    return false;
  }

  // Priority to the config (e.g. in code, env)
  const envIsCollecting = getMuiXTelemetryEnv('IS_COLLECTING');
  if (typeof envIsCollecting === 'boolean') {
    return envIsCollecting;
  }

  if (typeof telemetryContext.config.isCollecting === 'boolean') {
    return telemetryContext.config.isCollecting;
  }

  return false;
}

const muiXTelemetry = {
  send: (event: TelemetryEvent) => {
    if (!shouldSendTelemetry()) {
      return;
    }

    const eventPayload = {
      ...event,
      context: {
        ...telemetryContext.traits,
        licenseKey: getLicenseKey(),
      },
    };

    if (getMuiXTelemetryEnv('DEBUG')) {
      // eslint-disable-next-line no-console
      console.log('[mui-x-telemetry]', JSON.stringify(eventPayload, null, 2));
    }

    // Ignore if fetch is not available (e.g. Node.js before v18)
    if (typeof fetch !== 'function') {
      return;
    }

    // TODO: batch events and send them in a single request when there will be more
    fetch('https://x-telemetry.up.railway.app/api/v1/telemetry/record', {
      // fetch('http://localhost:8000/api/v1/telemetry/record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([eventPayload]),
    });
  },
  events: {
    licenseVerification: (payload: {
      licenseStatus: string;
      releaseInfo: string;
      packageName: string;
    }) => ({
      eventName: 'licenseVerification',
      payload,
    }),
  },
  debug: () => {
    setMuiXTelemetryEnv('DEBUG', true);
  },
  enable: () => {
    setMuiXTelemetryEnv('IS_COLLECTING', true);
  },
  disable: () => {
    setMuiXTelemetryEnv('IS_COLLECTING', false);
  },
};

export default muiXTelemetry;
