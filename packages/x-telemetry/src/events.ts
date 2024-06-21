import telemetryContext from './context';
import { TelemetryEventContext, TelemetryEvent } from './types';

function hash(...attrs: string[]): string {
  return btoa(attrs.join(''));
}

function oncePerSession<T extends TelemetryEvent>(payload: T): T | null {
  if (typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined') {
    const sessionKey = `__mui_x_telemetry_${hash(
      payload.eventName,
      payload.context.packageName,
      payload.context.packageReleaseInfo,
    )}`;
    if (window.sessionStorage.getItem(sessionKey) === telemetryContext.traits.sessionId) {
      return null;
    }

    window.sessionStorage.setItem(sessionKey, telemetryContext.traits.sessionId);
  }

  return payload;
}

const muiXTelemetryEvents = {
  licenseVerification: (
    context: TelemetryEventContext,
    payload: {
      licenseStatus?: string;
    },
  ) => {
    return oncePerSession({
      eventName: 'licenseVerification',
      payload,
      context,
    });
  },
};

export default muiXTelemetryEvents;
