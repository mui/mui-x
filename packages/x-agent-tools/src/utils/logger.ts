import { appendFileSync, statSync, truncateSync } from 'node:fs';

/** Truncate the log past 5 MB, checked on startup: bounds growth across restarts, not within one run. */
export const MAX_LOG_BYTES = 5 * 1024 * 1024;

const formatError = (error: unknown): string => {
  if (error instanceof Error) {
    return ` ${error.stack ?? error.message}`;
  }
  if (error) {
    return ` ${String(error)}`;
  }
  return '';
};

/** Log to both stderr (visible in the host UI) and `logPath` (persisted for later). */
export const buildCombinedLogger = (
  logPath: string,
  consoleErr: (message: string, error?: unknown) => void = console.error,
  appendFile: (path: string, line: string) => void = appendFileSync,
  fsOps: {
    statSize: (path: string) => number;
    truncate: (path: string) => void;
  } = { statSize: (path) => statSync(path).size, truncate: (path) => truncateSync(path, 0) },
) => {
  // Truncate on startup if the log has grown past the cap.
  try {
    if (fsOps.statSize(logPath) > MAX_LOG_BYTES) {
      fsOps.truncate(logPath);
    }
  } catch {
    // File may not exist yet (first run) or be inaccessible; nothing to truncate.
  }
  return (message: string, error?: unknown): void => {
    consoleErr(message, error);
    try {
      appendFile(logPath, `[${new Date().toISOString()}] ${message}${formatError(error)}\n`);
    } catch (writeErr) {
      // Surface the reason once (permission denied, disk full, …) so users aren't left wondering
      // why the log is empty. Logging must never crash the host.
      consoleErr(`log file write failed (${logPath})`, writeErr);
    }
  };
};
