import { appendFileSync, statSync, truncateSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

/** Local log file per machine; ~/.mui-mcp.log. Tail with `tail -f ~/.mui-mcp.log`. */
export const DEFAULT_LOG_PATH = join(homedir(), '.mui-mcp.log');

/** Cap the log at 5 MB so a long-lived CLI can't grow it forever. */
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

/** Log to both stderr (visible in MCP host UI) and a file (persisted for later). */
export const buildCombinedLogger = (
  logPath: string = DEFAULT_LOG_PATH,
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
      // Surface the reason once (permission denied, disk full, etc.) so users aren't left
      // wondering why ~/.mui-mcp.log is empty. Logging itself must never crash the MCP.
      consoleErr(`mui-mcp: log file write failed (${logPath})`, writeErr);
    }
  };
};
