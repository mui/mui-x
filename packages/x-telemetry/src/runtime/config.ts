interface TelemetryEnvConfig {
  NODE_ENV: string | '<unknown>';
  IS_COLLECTING: boolean | undefined;
  DEBUG: boolean;
}

declare global {
  // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/naming-convention, vars-on-top
  var __MUI_X_TELEMETRY_DISABLED__: boolean | undefined;
}

const envEnabledValues = ['1', 'true', 'yes', 'y'];
const envDisabledValues = ['0', 'false', 'no', 'n'];

function getBooleanEnv(value?: string): boolean | undefined {
  if (!value) {
    return undefined;
  }
  if (envEnabledValues.includes(value)) {
    return true;
  }
  if (envDisabledValues.includes(value)) {
    return false;
  }
  return undefined;
}

function getBooleanEnvFromEnvObject(envKey: string, envObj: Record<string, any>) {
  const keys = Object.keys(envObj);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    if (!key.endsWith(envKey)) {
      continue;
    }
    const value = getBooleanEnv(envObj[key]?.toLowerCase());
    if (typeof value === 'boolean') {
      return value;
    }
  }

  return undefined;
}

function getIsTelemetryCollecting(): boolean | undefined {
  // Check global variable
  // eslint-disable-next-line no-underscore-dangle
  const globalValue = globalThis.__MUI_X_TELEMETRY_DISABLED__;
  if (typeof globalValue === 'boolean') {
    // If disabled=true, telemetry is disabled
    // If disabled=false, telemetry is enabled
    return !globalValue;
  }

  try {
    if (typeof process !== 'undefined' && process.env && typeof process.env === 'object') {
      const result = getBooleanEnvFromEnvObject('MUI_X_TELEMETRY_DISABLED', process.env);
      if (typeof result === 'boolean') {
        // If disabled=true, telemetry is disabled
        // If disabled=false, telemetry is enabled
        return !result;
      }
    }
  } catch (_) {
    // If there is an error, return the default value
  }

  try {
    // Some build tools replace env variables on compilation
    // e.g. Next.js, webpack EnvironmentPlugin
    const envValue =
      process.env.MUI_X_TELEMETRY_DISABLED ||
      process.env.NEXT_PUBLIC_MUI_X_TELEMETRY_DISABLED ||
      process.env.GATSBY_MUI_X_TELEMETRY_DISABLED ||
      process.env.REACT_APP_MUI_X_TELEMETRY_DISABLED ||
      process.env.PUBLIC_MUI_X_TELEMETRY_DISABLED;
    const result = getBooleanEnv(envValue);
    if (typeof result === 'boolean') {
      // If disabled=true, telemetry is disabled
      // If disabled=false, telemetry is enabled
      return !result;
    }
  } catch (_) {
    // If there is an error, return the default value
  }

  return undefined;
}

function getIsDebugModeEnabled(): boolean {
  try {
    // Check global variable
    // eslint-disable-next-line no-underscore-dangle
    const globalValue = (globalThis as any).__MUI_X_TELEMETRY_DEBUG__;
    if (typeof globalValue === 'boolean') {
      return globalValue;
    }

    if (typeof process !== 'undefined' && process.env && typeof process.env === 'object') {
      const result = getBooleanEnvFromEnvObject('MUI_X_TELEMETRY_DEBUG', process.env);
      if (typeof result === 'boolean') {
        return result;
      }
    }

    // e.g. Webpack EnvironmentPlugin
    if (process.env.MUI_X_TELEMETRY_DEBUG) {
      const result = getBooleanEnv(process.env.MUI_X_TELEMETRY_DEBUG);
      if (typeof result === 'boolean') {
        return result;
      }
    }
  } catch (_) {
    // If there is an error, return the default value
  }

  try {
    // e.g. Next.js, webpack EnvironmentPlugin
    const envValue =
      process.env.MUI_X_TELEMETRY_DEBUG ||
      process.env.NEXT_PUBLIC_MUI_X_TELEMETRY_DEBUG ||
      process.env.GATSBY_MUI_X_TELEMETRY_DEBUG ||
      process.env.REACT_APP_MUI_X_TELEMETRY_DEBUG ||
      process.env.PUBLIC_MUI_X_TELEMETRY_DEBUG;
    const result = getBooleanEnv(envValue);
    if (typeof result === 'boolean') {
      return result;
    }
  } catch (_) {
    // If there is an error, return the default value
  }

  return false;
}

/**
 * !IMPORTANT: Don't use the result for tree-shaking.
 * @returns Current Node.js environment or `<unknown>` if it cannot be determined.
 */
function getNodeEnv(): string {
  try {
    // eslint-disable-next-line mui/consistent-production-guard
    return process.env.NODE_ENV ?? '<unknown>';
  } catch (_) {
    return '<unknown>';
  }
}

let cachedEnv: TelemetryEnvConfig | null = null;

export function getTelemetryEnvConfig(skipCache: boolean = false): TelemetryEnvConfig {
  if (skipCache || !cachedEnv) {
    cachedEnv = {
      NODE_ENV: getNodeEnv(),
      IS_COLLECTING: getIsTelemetryCollecting(),
      DEBUG: getIsDebugModeEnabled(),
    };
  }

  return cachedEnv;
}

export function getTelemetryEnvConfigValue<K extends keyof TelemetryEnvConfig>(
  key: K,
): TelemetryEnvConfig[K] {
  return getTelemetryEnvConfig()[key];
}

export function setTelemetryEnvConfigValue<K extends keyof TelemetryEnvConfig>(
  key: K,
  value: NonNullable<TelemetryEnvConfig[K]>,
) {
  getTelemetryEnvConfig()[key] = value;
}
