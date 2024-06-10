/* eslint-disable no-underscore-dangle */
import { ponyfillGlobal } from "@mui/utils";

interface TelemetryEnv {
    DISABLED?: any
    DEBUG?: any
}

let cachedEnv: TelemetryEnv | null = null;

export function getMuiXTelemetryEnv(): TelemetryEnv {
    if (!cachedEnv) {
        cachedEnv = {
            ...(typeof process !== 'undefined' && process.env && ({
                DISABLED: !!process.env.MUI_X_TELEMETRY_DISABLED,
                DEBUG: !!process.env.MUI_X_TELEMETRY_DEBUG,
            })),
            ...(ponyfillGlobal.__MUI_X_TELEMETRY_DISABLED__ && {
                DISABLED: !!ponyfillGlobal.__MUI_X_TELEMETRY_DISABLED__,
            }),
            ...(ponyfillGlobal.__MUI_X_TELEMETRY_DEBUG__ && {
                DEBUG: !!ponyfillGlobal.__MUI_X_TELEMETRY_DEBUG__,
            }),
        }
    }
    return cachedEnv!;
}

export function setMuiXTelemetryEnv(key: keyof TelemetryEnv, value: any) {
    getMuiXTelemetryEnv()[key] = value;
}
