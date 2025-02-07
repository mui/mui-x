export interface TelemetryEventContext {
  licenseKey?: string;
  packageReleaseInfo: string;
  packageName: string;
}

export interface TelemetryEvent {
  eventName: string;
  payload: Record<string, any>;
  context: TelemetryEventContext;
}
