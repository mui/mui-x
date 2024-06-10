/* eslint-disable no-underscore-dangle */

import { ponyfillGlobal } from "@mui/utils";
import { getMuiXTelemetryEnv, setMuiXTelemetryEnv } from "./env";
import { debugLog } from "./logger";
import telemetryContext from './context';

interface TelemetryEvent {
    eventName: string;
    payload: any;
}

const getLicenseKey = (): string | undefined => {
    return ponyfillGlobal.__MUI_LICENSE_INFO__?.key || undefined
}

const muiXTelemetry = {
    send: (event: TelemetryEvent) => {
        if (telemetryContext.isTelemetryDisabled) {
            debugLog(`Telemetry disabled (config), skipping event`)
            return;
        }

        if (getMuiXTelemetryEnv().DISABLED) {
            debugLog(`Telemetry disabled (env), skipping event`)
            return
        }

        // Temporarily collect telemetry only in not-production environment
        if (process.env.NODE_ENV === 'production') {
            debugLog(`Telemetry disabled (production), skipping event`)
            return;
        }

        // TODO: replace with production host
        fetch('http://localhost:8000/api/v1/telemetry/record', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([{
                ...event,
                context: {
                  ...telemetryContext.traits,
                  licenseKey: getLicenseKey(),
                },
            }]),
        })
    },
    events: {
        licenseVerification: (payload: {
            licenseStatusExpiryDate?: number;
            licenseStatus: string;
            releaseInfo: string;
            packageName: string;
        }) => ({
            eventName: 'licenseVerification',
            payload: {
                ...payload,
                licenseStatusExpiryDate: payload.licenseStatusExpiryDate && new Date(payload.licenseStatusExpiryDate).toISOString().split('T')[0],
            },
        }),
    },
    debug: () => {
        setMuiXTelemetryEnv('DEBUG', true)
    },
    enable: () => {
        setMuiXTelemetryEnv('DISABLED', false)
    },
    disable: () => {
        setMuiXTelemetryEnv('DISABLED', true)
    },
}

export default muiXTelemetry;
