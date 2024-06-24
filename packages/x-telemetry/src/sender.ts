/* eslint-disable no-console */
import { ponyfillGlobal } from '@mui/utils';
import getTelemetryContext, { TelemetryContextType } from './get-context';
import { getMuiXTelemetryEnv } from './config';
import { TelemetryEvent } from './types';
import { md5 } from './encoding/md5';

function shouldSendTelemetry(telemetryContext: TelemetryContextType): boolean {
  // Disable collection of the telemetry
  // in production environment
  if (process.env.NODE_ENV === 'production') {
    return false;
  }

  // Priority to the config (e.g. in code, env)
  const envIsCollecting = getMuiXTelemetryEnv('IS_COLLECTING');
  if (typeof envIsCollecting === 'boolean') {
    return envIsCollecting;
  }

  // Disable collection of the telemetry in CI builds,
  // as it not related to development process
  if (telemetryContext.traits.isCI) {
    return false;
  }

  if (typeof telemetryContext.config.isCollecting === 'boolean') {
    return telemetryContext.config.isCollecting;
  }

  // Disabled by default
  return false;
}

function getLicenseKeyHash(): string | undefined {
  // eslint-disable-next-line no-underscore-dangle
  const licenseKey = ponyfillGlobal.__MUI_LICENSE_INFO__?.key || undefined;
  return licenseKey ? md5(licenseKey) : undefined;
}

function sendMuiXTelemetryEvent(event: TelemetryEvent | null) {
  const telemetryContext = getTelemetryContext();
  if (!event || !shouldSendTelemetry(telemetryContext)) {
    return;
  }

  const eventPayload = {
    ...event,
    context: {
      ...telemetryContext.traits,
      licenseKeyHash: getLicenseKeyHash(),
      ...event.context,
    },
  };

  if (getMuiXTelemetryEnv('DEBUG')) {
    console.log('[mui-x-telemetry] event', JSON.stringify(eventPayload, null, 2));
    return;
  }

  // Ignore if fetch is not available (e.g. Node.js < v18, IE, etc.)
  if (typeof fetch !== 'function') {
    return;
  }

  // TODO: batch events and send them in a single request when there will be more
  fetch('https://x-telemetry.up.railway.app/api/v1/telemetry/record', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify([eventPayload]),
  });
}

export default sendMuiXTelemetryEvent;
