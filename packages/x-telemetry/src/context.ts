// This file will be modified by the `postinstall` script.
// See postinstall/index.ts for more information.

export interface TelemetryContextType {
  config: {
    isInitialized: boolean;
    /** Tracks whether we've already attempted runtime projectId resolution (avoids repeated fetch) */
    runtimeProjectIdResolved?: boolean;
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
    // A hash of the git remote URL. Identifies the repository.
    // Null when git is not available (e.g. Docker, CI, ignore-scripts).
    repoHash?: string | null;
    // A hash of the package.json name. Identifies the application within a monorepo.
    // Null when no package.json with a name field is found.
    packageNameHash?: string | null;
    // A hash of the git root path or cwd. Last-resort identifier, unique per developer.
    rootPathHash?: string | null;
    // Best available identifier: repoHash || packageNameHash || rootPathHash.
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
