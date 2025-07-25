interface TelemetryEnvConfig {
  NODE_ENV: string | '<unknown>';
  IS_COLLECTING: boolean | undefined;
  DEBUG: boolean;
}

declare namespace globalThis {
  // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/naming-convention
  let __MUI_X_TELEMETRY_DISABLED__: boolean | undefined;
}

const envEnabledValues = new Set(['1', 'true', 'yes', 'y']);
const envDisabledValues = new Set(['0', 'false', 'no', 'n']);

function parseBoolean(value?: string, varName: string): boolean | undefined {
  if (!value) {
    return undefined;
  }
  if (envEnabledValues.has(value)) {
    return true;
  }
  if (envDisabledValues.has(value)) {
    return false;
  }
  console.warn(`The environment variable "${varName}" ("${value}") is not a valid boolean value.`);
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
    // Some build tools replace env variables on compilation
    // e.g. Next.js, webpack EnvironmentPlugin
    const envValue =
      process.env.MUI_X_TELEMETRY_DISABLED ||
      process.env.NEXT_PUBLIC_MUI_X_TELEMETRY_DISABLED ||
      process.env.GATSBY_MUI_X_TELEMETRY_DISABLED ||
      process.env.REACT_APP_MUI_X_TELEMETRY_DISABLED ||
      process.env.PUBLIC_MUI_X_TELEMETRY_DISABLED;
    const result = parseBoolean(envValue, 'MUI_X_TELEMETRY_DISABLED');
    if (typeof result === 'boolean') {
      // If disabled=true, telemetry is disabled
      // If disabled=false, telemetry is enabled
      return !result;
    }
  } catch {
    // If there is an error, return the default value
  }

  return undefined;
}

function getIsDebugModeEnabled(): boolean {
  // Check global variable
  // eslint-disable-next-line no-underscore-dangle
  const globalValue = (globalThis as any).__MUI_X_TELEMETRY_DEBUG__;
  if (typeof globalValue === 'boolean') {
    return globalValue;
  }

  try {
    // Some build tools replace env variables on compilation
    // e.g. Next.js, webpack EnvironmentPlugin
    const envValue =
      process.env.MUI_X_TELEMETRY_DEBUG ||
      process.env.NEXT_PUBLIC_MUI_X_TELEMETRY_DEBUG ||
      process.env.GATSBY_MUI_X_TELEMETRY_DEBUG ||
      process.env.REACT_APP_MUI_X_TELEMETRY_DEBUG ||
      process.env.PUBLIC_MUI_X_TELEMETRY_DEBUG;
    const result = parseBoolean(envValue, 'MUI_X_TELEMETRY_DEBUG');
    if (typeof result === 'boolean') {
      return result;
    }
  } catch {
    // If there is an error, return the default value
  }

  return false;
}

function getNodeEnv(): string {
  try {
    return process.env.NODE_ENV ?? '<unknown>';
  } catch {
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
