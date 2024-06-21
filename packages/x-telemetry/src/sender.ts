import { ponyfillGlobal } from '@mui/utils';
import { getMuiXTelemetryEnv } from './config';
import telemetryContext from './context';
import { TelemetryEvent } from './types';

function shouldSendTelemetry(): boolean {
  // Disable collection of the telemetry
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

  // Disabled by default
  return false;
}

function getLicenseKey(): string | undefined {
  // eslint-disable-next-line no-underscore-dangle
  return ponyfillGlobal.__MUI_LICENSE_INFO__?.key || undefined;
}

function sendMuiXTelemetryEvent(event: TelemetryEvent | null) {
  if (!event || !shouldSendTelemetry()) {
    return;
  }

  const eventPayload = {
    ...event,
    context: {
      ...telemetryContext.traits,
      licenseKey: getLicenseKey(),
      ...event.context,
    },
  };

  if (getMuiXTelemetryEnv('DEBUG')) {
    // eslint-disable-next-line no-console
    console.log('[mui-x-telemetry]', JSON.stringify(eventPayload, null, 2));
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
