// This file will be modified by the `postinstall` script.
// See scripts/postinstall.ts for more information.

export interface TelemetryContextType {
  config: {
    isCollecting: true | false | null;
  };
  traits: Record<string, any>;
}

export default {
  config: {
    isCollecting: null,
  },
  traits: {},
} as TelemetryContextType;
