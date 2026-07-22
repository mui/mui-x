import { z } from 'zod';
import type { AgentTool } from '../types';

/**
 * Pin a tool to the `AgentTool` type (for inference) and make it self-validating: `execute` parses
 * its input against `inputSchema` first, so direct library consumers get the same validation the
 * MCP SDK already runs, and any future `.default()`/`.transform()` applies on both paths.
 */
export function wrapTool<Input extends z.ZodObject, Output extends z.ZodType, Event = never>(
  tool: AgentTool<Input, Output, Event>,
): AgentTool<Input, Output, Event> {
  return {
    ...tool,
    // `async` so a parse failure surfaces as a rejected promise, not a synchronous throw.
    // `parse` yields the schema's output type; the public `execute` is typed on the input (pre-
    // validation) type, so re-assert it at the validated boundary. They coincide for these schemas.
    execute: async (input, context) =>
      tool.execute(tool.inputSchema.parse(input) as z.input<Input>, context),
  };
}
