type WindowStorageType = 'localStorage' | 'sessionStorage';

const prefix = '__mui_x_telemetry_';

function getStorageKey(key: string): string {
  return prefix + btoa(key);
}

export function setWindowStorageItem(type: WindowStorageType, key: string, value: string): boolean {
  try {
    if (typeof window !== 'undefined' && window[type]) {
      window[type].setItem(getStorageKey(key), value);
      return true;
    }
  } catch (_) {
    // Storage is unavailable, skip it
  }

  return false;
}

export function getWindowStorageItem(type: WindowStorageType, key: string): string | null {
  try {
    if (typeof window !== 'undefined' && window[type]) {
      return window[type].getItem(getStorageKey(key));
    }
  } catch (_) {
    // Storage is unavailable, skip it
  }

  return null;
}
