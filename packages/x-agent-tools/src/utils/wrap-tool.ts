import { z } from 'zod';
import type { ChatTool } from '../types';

/** Identity helper that pins a tool object to the `ChatTool` type (for inference at call sites). */
export function wrapTool<Input extends z.AnyZodObject, Output extends z.ZodTypeAny>(
  obj: ChatTool<Input, Output>,
) {
  return obj;
}
