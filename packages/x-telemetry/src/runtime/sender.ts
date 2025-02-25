import type { TelemetryContextType } from './get-context';
import { getTelemetryEnvConfigValue } from './config';
import { TelemetryEvent } from '../types';
import { fetchWithRetry } from './fetcher';
import * as packageJson from '../../package.json';

function shouldSendTelemetry(telemetryContext: TelemetryContextType): boolean {
  // Priority to the config (e.g. in code, env)
  const envIsCollecting = getTelemetryEnvConfigValue('IS_COLLECTING');
  if (typeof envIsCollecting === 'boolean') {
    return envIsCollecting;
  }

  // Disable collection of the telemetry in CI builds,
  // as it not related to development process
  if (telemetryContext.traits.isCI) {
    return false;
  }

  // Disabled by default
  return false;
}

const sendMuiXTelemetryRetries = 3;

async function sendMuiXTelemetryEvent(event: TelemetryEvent | null) {
  try {
    // Disable collection of the telemetry
    // in production environment
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    const { default: getTelemetryContext } = await import('./get-context');
    const telemetryContext = await getTelemetryContext();
    if (!event || !shouldSendTelemetry(telemetryContext)) {
      return;
    }

    const eventPayload = {
      ...event,
      context: {
        ...telemetryContext.traits,
        ...event.context,
      },
    };

    if (getTelemetryEnvConfigValue('DEBUG')) {
      console.log('[mui-x-telemetry] event', JSON.stringify(eventPayload, null, 2));
      return;
    }

    // TODO: batch events and send them in a single request when there will be more
    await fetchWithRetry(
      'https://x-telemetry.mui.com/api/v1/telemetry/record',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Telemetry-Client-Version': packageJson.version,
          'X-Telemetry-Node-Env': (process.env.NODE_ENV as any) ?? '<unknown>',
        },
        body: JSON.stringify([eventPayload]),
      },
      sendMuiXTelemetryRetries,
    );
  } catch (_) {
    console.log('[mui-x-telemetry] error', _);
  }
}

export default sendMuiXTelemetryEvent;
