import getTelemetryContext from './get-context';
import { TelemetryEventContext, TelemetryEvent } from './types';
import {
  getWindowStorageItem,
  isWindowStorageAvailable,
  setWindowStorageItem,
} from './window-storage';

function oncePerSession<T extends TelemetryEvent>(payload: T): T | null {
  const {
    traits: { sessionId },
  } = getTelemetryContext();
  const {
    eventName,
    context: { packageName, packageReleaseInfo },
  } = payload;

  if (isWindowStorageAvailable('sessionStorage')) {
    const sessionKey = eventName + packageName + packageReleaseInfo;
    if (getWindowStorageItem('sessionStorage', sessionKey) === sessionId) {
      return null;
    }

    setWindowStorageItem('sessionStorage', sessionKey, sessionId);
  }

  return payload;
}

const muiXTelemetryEvents = {
  licenseVerification: (
    context: TelemetryEventContext,
    payload: {
      licenseStatus?: string;
      licensePlanVersion?: string;
      licenseLicensingModel?: string;
      licenseScope?: string;
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
