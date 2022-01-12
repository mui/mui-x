/**
 * @ignore - do not document.
 * TODO: Stop exporting in v6
 */
export interface Logger {
  debug: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
}
