import { appendFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

/** Local log file per machine; ~/.mui-mcp.log. Tail with `tail -f ~/.mui-mcp.log`. */
export const DEFAULT_LOG_PATH = join(homedir(), '.mui-mcp.log');

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
) => {
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
