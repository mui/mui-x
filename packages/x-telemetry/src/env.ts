/* eslint-disable no-underscore-dangle */
import { ponyfillGlobal } from '@mui/utils';

interface TelemetryEnv {
  NODE_ENV?: string;
  IS_COLLECTING: boolean | null;
  DEBUG: boolean;
}

let cachedEnv: TelemetryEnv | null = null;

function getMuiXEnabledEnvs() {
  return (
    process.env.MUI_X_TELEMETRY_ENABLED ||
    process.env.REACT_APP_MUI_X_TELEMETRY_ENABLED ||
    process.env.NEXT_PUBLIC_MUI_X_TELEMETRY_ENABLED ||
    process.env.GATSBY_MUI_X_TELEMETRY_ENABLED ||
    process.env.PUBLIC_MUI_X_TELEMETRY_ENABLED
  );
}

function getMuiXDisabledEnvs() {
  return (
    process.env.MUI_X_TELEMETRY_DISABLED ||
    process.env.REACT_APP_MUI_X_TELEMETRY_DISABLED ||
    process.env.NEXT_PUBLIC_MUI_X_TELEMETRY_DISABLED ||
    process.env.GATSBY_MUI_X_TELEMETRY_DISABLED ||
    process.env.PUBLIC_MUI_X_TELEMETRY_DISABLED
  );
}

function getEnvObject(): TelemetryEnv {
  if (!cachedEnv) {
    cachedEnv = {
      NODE_ENV: process.env.NODE_ENV,
      IS_COLLECTING: null,
      DEBUG: false,

      ...(ponyfillGlobal.__MUI_X_TELEMETRY_DEBUG__ && {
        DEBUG: !!ponyfillGlobal.__MUI_X_TELEMETRY_DEBUG__,
      }),
    };

    try {
      const disabledEnv = getMuiXDisabledEnvs();
      const enabledEnv = getMuiXEnabledEnvs();

      if (disabledEnv === 'true' || enabledEnv === 'false') {
        cachedEnv!.IS_COLLECTING = false;
      }

      if (enabledEnv === 'true' || disabledEnv === 'false') {
        cachedEnv!.IS_COLLECTING = true;
      }
    } catch (err) {
      // skip if some problems with accessing process.env.*
    }

    if (typeof ponyfillGlobal.__MUI_X_TELEMETRY_DISABLED__ === 'boolean') {
      cachedEnv!.IS_COLLECTING = !ponyfillGlobal.__MUI_X_TELEMETRY_DISABLED__;
    }

    if (typeof ponyfillGlobal.__MUI_X_TELEMETRY_ENABLED__ === 'boolean') {
      cachedEnv!.IS_COLLECTING = ponyfillGlobal.__MUI_X_TELEMETRY_ENABLED__;
    }
  }
  return cachedEnv!;
}

export function getMuiXTelemetryEnv<K extends keyof TelemetryEnv>(key: K): TelemetryEnv[K] {
  return getEnvObject()[key];
}

export function setMuiXTelemetryEnv<K extends keyof TelemetryEnv>(
  key: K,
  value: NonNullable<TelemetryEnv[K]>,
) {
  getEnvObject()[key] = value;
}
