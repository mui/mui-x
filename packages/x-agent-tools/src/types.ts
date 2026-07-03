import { z } from 'zod';

export type Logger = (message: string, error?: unknown) => void;

/**
 * Per-call context, so signal/progress aren't fixed at tool construction. `Event` is the tool's own
 * progress event type; it defaults to `never`, i.e. "this tool reports no progress".
 */
export interface ToolExecutionContext<Event = never> {
  /** Aborts the tool's in-flight fetches when the host cancels the request. */
  signal?: AbortSignal;
  /**
   * Reports tool-specific progress; `never` (no-op) unless the tool declares an `Event`.
   * @param {Event} event The progress event the tool emits.
   * @returns {void | Promise<void>} Optionally a promise the tool awaits before continuing.
   */
  onProgress?: (event: Event) => void | Promise<void>;
}

export interface AgentTool<
  Input extends z.AnyZodObject = z.AnyZodObject,
  Output extends z.ZodTypeAny = z.ZodTypeAny,
  Event = never,
> {
  /** Public tool name a host registers (e.g. `useMuiDocs`). Override via `ToolOverrides`. */
  name: string;
  description: string;
  inputSchema: Input;
  outputSchema: Output;
  execute: (
    input: z.input<Input>,
    context?: ToolExecutionContext<Event>,
  ) => Promise<z.output<Output>>;
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
