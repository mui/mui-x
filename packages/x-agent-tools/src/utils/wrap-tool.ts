import { z } from 'zod';
import type { ChatTool } from '../types';

/**
 * Pin a tool to the `ChatTool` type (for inference) and make it self-validating: `execute` parses
 * its input against `inputSchema` first, so direct library consumers get the same validation the
 * MCP SDK already runs, and any future `.default()`/`.transform()` applies on both paths.
 */
export function wrapTool<Input extends z.AnyZodObject, Output extends z.ZodTypeAny>(
  tool: ChatTool<Input, Output>,
): ChatTool<Input, Output> {
  return {
    ...tool,
    // `async` so a parse failure surfaces as a rejected promise, not a synchronous throw.
    execute: async (input, context) => tool.execute(tool.inputSchema.parse(input), context),
  };
}
