/* eslint-disable no-underscore-dangle */
import { ponyfillGlobal } from '@mui/utils';

interface TelemetryEnv {
  NODE_ENV?: string;
  IS_COLLECTING?: boolean;
  DEBUG: boolean;
}

let cachedEnv: TelemetryEnv | null = null;

function getEnvObject(): TelemetryEnv {
  if (!cachedEnv) {
    cachedEnv = {
      NODE_ENV: process.env.NODE_ENV,
      IS_COLLECTING: null,
      DEBUG: false,

      ...(typeof ponyfillGlobal.__MUI_X_TELEMETRY_DISABLED__ === 'boolean' && {
        IS_COLLECTING: !ponyfillGlobal.__MUI_X_TELEMETRY_DISABLED__,
      }),
      ...(typeof ponyfillGlobal.__MUI_X_TELEMETRY_ENABLED__ === 'boolean' && {
        IS_COLLECTING: !!ponyfillGlobal.__MUI_X_TELEMETRY_ENABLED__,
      }),
      ...(ponyfillGlobal.__MUI_X_TELEMETRY_DEBUG__ && {
        DEBUG: !!ponyfillGlobal.__MUI_X_TELEMETRY_DEBUG__,
      }),
    };
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
