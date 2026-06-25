import { z } from 'zod';

export type ZodObjectAny = z.ZodObject<any, any, any, any> | z.ZodString;

export interface ChatTool<Input extends ZodObjectAny, Output extends ZodObjectAny> {
  name: string;
  publicName: string;
  description: string;
  inputSchema: Input;
  outputSchema: Output;
  execute: (input: z.input<Input>) => Promise<z.output<Output>>;
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

export interface QueueOptions {
  throwOnTimeout?: boolean;
  concurrency?: number;
  timeout?: number;
}

export type CacheEntry = {
  content: string;
  timestamp: number;
};
