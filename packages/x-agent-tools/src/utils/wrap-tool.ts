import { z } from 'zod';
import type { AgentTool } from '../types';

/**
 * Pin a tool to the `AgentTool` type (for inference) and make it self-validating: `execute` parses
 * its input against `inputSchema` first, so direct library consumers get the same validation the
 * MCP SDK already runs, and any future `.default()`/`.transform()` applies on both paths.
 */
export function wrapTool<Input extends z.AnyZodObject, Output extends z.ZodTypeAny, Event = never>(
  tool: AgentTool<Input, Output, Event>,
): AgentTool<Input, Output, Event> {
  return {
    ...tool,
    // `async` so a parse failure surfaces as a rejected promise, not a synchronous throw.
    execute: async (input, context) => tool.execute(tool.inputSchema.parse(input), context),
  };
}
