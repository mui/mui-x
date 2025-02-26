export interface TelemetryEventContext {
  licenseKey?: string;
}

export interface TelemetryEvent {
  eventName: string;
  payload: Record<string, any>;
  context: TelemetryEventContext;
}
