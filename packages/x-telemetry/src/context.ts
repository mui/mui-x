interface TelemetryContext {
    isTelemetryDisabled: boolean;
    traits: Record<string, any>;
}

export default {
    isTelemetryDisabled: false,
    traits: {
        systemPlatform: 'uninitialized',
    }
} as TelemetryContext
