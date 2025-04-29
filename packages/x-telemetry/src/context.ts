// This file will be modified by the `postinstall` script.
// See postinstall/index.ts for more information.

export interface TelemetryContextType {
  config: {
    isInitialized: boolean;
  };
  traits: Record<string, any> & {
    // A hash of value that is meant to be stable between different machine boots.
    // In practice, it's more of an OS installation ID than a machine ID.
    machineId?: string | null;
    // A hash of a value that is meant to be stable between different machine boots.
    // Similar to machineId, but computed differently.
    fingerprint?: {
      fullHash?: string | null;
      coreHash?: string | null;
      components?: Record<string, any> | null;
    } | null;
    // A hash of a value that is meant to be stable between different component uses inside the same code project.
    projectId?: string | null;
    // A random ID stored in localStorage.
    anonymousId?: string | null;
    // A random ID stored in sessionStorage.
    sessionId?: string | null;
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
