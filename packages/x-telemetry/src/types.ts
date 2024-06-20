export interface TelemetryEventContext {
  packageReleaseInfo: string;
  packageName: string;
}

export interface TelemetryEvent {
  eventName: string;
  payload: Record<string, any>;
  context: TelemetryEventContext;
}
