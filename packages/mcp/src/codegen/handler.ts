import type { GenerateReactCodeResult, GenerateReactCodeTool } from '@mui/x-agent-tools';
import { buildCodegenProgressForwarder } from './progress';

type FormatCodegenText = (result: GenerateReactCodeResult) => string;

/** Per-request handler for the `generateReactCode` MCP tool. */
export const buildCodegenHandler = (deps: {
  tool: Pick<GenerateReactCodeTool, 'name' | 'execute'>;
  formatText: FormatCodegenText;
  log?: (message: string, error?: unknown) => void;
}) => {
  const { tool, formatText, log = console.error } = deps;
  return async (input: any, extra?: any) => {
    const startTime = Date.now();
    const onProgress = buildCodegenProgressForwarder(extra, log);
    // Forward the request's abort signal + progress hook per call, so codegen stops on cancel.
    try {
      const result = await tool.execute(input, { onProgress, signal: extra?.signal });
      log(`Executed ${tool.name} in ${Date.now() - startTime}ms`);
      return {
        // Backward-compat: clients ignoring `structuredContent` still need the files in text.
        content: [{ type: 'text' as const, text: formatText(result) }],
        structuredContent: result,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      log(`${tool.name} failed in ${Date.now() - startTime}ms: ${message}`);
      return {
        content: [{ type: 'text' as const, text: message }],
        isError: true,
      };
    }
  };
};
