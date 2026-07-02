import { z } from 'zod';

export type Logger = (message: string, error?: unknown) => void;

/** Progress event a run emits (codegen only). */
export type ToolProgressEvent =
  | { kind: 'file'; filename: string; filesSeen: number }
  | { kind: 'done'; filesSeen: number };

/** Per-call context, so signal/progress aren't fixed at tool construction. */
export interface ToolExecutionContext {
  // Aborts the tool's in-flight fetches when the host cancels the request.
  signal?: AbortSignal;
  onProgress?: (event: ToolProgressEvent) => void | Promise<void>;
}

export interface AgentTool<
  Input extends z.AnyZodObject = z.AnyZodObject,
  Output extends z.ZodTypeAny = z.ZodTypeAny,
> {
  /** Public tool name a host registers (e.g. `useMuiDocs`). Override via `ToolOverrides`. */
  name: string;
  description: string;
  inputSchema: Input;
  outputSchema: Output;
  execute: (input: z.input<Input>, context?: ToolExecutionContext) => Promise<z.output<Output>>;
}

export interface PackageData {
  name: string;
  version: string;
  llmsUrl: string;
  llmsFullUrl: string;
}

export interface ToolOverrides {
  name?: string;
  description?: string;
}
