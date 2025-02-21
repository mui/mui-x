// This file will be modified by the `postinstall` script.
// See postinstall/index.ts for more information.

export interface TelemetryContextType {
  config: {
    isInitialized: boolean;
  };
  traits: Record<string, any> & {
    machineId?: string | null;
    projectId?: string | null;
    sessionId?: string | null;
    anonymousId?: string | null;
    isDocker?: boolean;
    isCI?: boolean;
  };
}

const defaultValue: TelemetryContextType = {
  config: {
    isInitialized: false,
  },
  traits: {},
};

export default defaultValue;
