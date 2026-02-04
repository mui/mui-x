import { writeFile } from 'node:fs/promises';
import type { TraceFileObjectFormat } from './types';

/**
 * Serializes a trace to JSON string format and saves it to a file.
 */
export async function serializeTrace(trace: TraceFileObjectFormat, filePath = 'trace.json') {
  return writeFile(filePath, JSON.stringify(trace, null, 2));
}
