export interface TelemetryEventContext {
  licenseKey?: string;
  xLicenseClientVersion?: string;
}

export interface TelemetryEvent {
  eventName: string;
  payload: Record<string, any>;
  context: TelemetryEventContext;
}
