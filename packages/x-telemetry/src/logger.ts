import { getMuiXTelemetryEnv } from "./env";

export function debugLog(...args: any[]) {
    if (getMuiXTelemetryEnv().DEBUG) {
        // eslint-disable-next-line no-console
        console.log(...args);
    }
}
