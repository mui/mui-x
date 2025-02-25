import FingerprintJS from '@fingerprintjs/fingerprintjs';
import telemetryContext from '../context';
import type { TelemetryContextType } from '../context';
import {
  getWindowStorageItem,
  setWindowStorageItem,
  isWindowStorageAvailable,
} from './window-storage';

function generateId(length: number): string {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

async function getMachineId(): Promise<string> {
  if (typeof navigator === 'undefined') {
    return '';
  }

  const fpPromise = FingerprintJS.load();
  const fp = await fpPromise;
  const result = await fp.get();
  return result.visitorId;
}

function getAnonymousId(): string {
  if (isWindowStorageAvailable('localStorage')) {
    const localStorageKey = 'anonymous_id';
    const existingAnonymousId = getWindowStorageItem('localStorage', localStorageKey);
    if (existingAnonymousId) {
      return existingAnonymousId;
    }

    const generated = generateId(32);
    if (setWindowStorageItem('localStorage', localStorageKey, generated)) {
      return generated;
    }
  }

  return '';
}

function getSessionId(): string {
  if (isWindowStorageAvailable('sessionStorage')) {
    const localStorageKey = 'session_id';
    const existingSessionId = getWindowStorageItem('sessionStorage', localStorageKey);
    if (existingSessionId) {
      return existingSessionId;
    }

    const generated = generateId(32);
    if (setWindowStorageItem('sessionStorage', localStorageKey, generated)) {
      return generated;
    }
  }

  return generateId(32);
}

async function getTelemetryContext(): Promise<TelemetryContextType> {
  // Initialize the context if it hasn't been initialized yet
  // (e.g. postinstall not run)
  if (!telemetryContext.config.isInitialized) {
    telemetryContext.traits.anonymousId = getAnonymousId();
    telemetryContext.traits.sessionId = getSessionId();
    telemetryContext.config.isInitialized = true;
  }

  if (!telemetryContext.traits.machineId) {
    telemetryContext.traits.machineId = await getMachineId();
  }

  return telemetryContext;
}

export { TelemetryContextType };
export default getTelemetryContext;
