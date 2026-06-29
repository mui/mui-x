import { buildCodegenProgressForwarder } from './progress';

type CodegenResult = {
  threadId: string;
  files: { filename: string; contents: string }[];
  explanation: string;
};

type CodegenTool = {
  publicName: string;
  execute: (input: any) => Promise<CodegenResult>;
};

type CodegenToolFactory = (opts: {
  onProgress?: ReturnType<typeof buildCodegenProgressForwarder>;
  signal?: AbortSignal;
}) => CodegenTool;

type FormatCodegenText = (result: CodegenResult) => string;

/** Per-request handler for the `generateReactCode` MCP tool. */
export const buildCodegenHandler = (deps: {
  codegenStatic: { publicName: string };
  createPerCallTool: CodegenToolFactory;
  formatText: FormatCodegenText;
  log?: (message: string, error?: unknown) => void;
}) => {
  const { codegenStatic, createPerCallTool, formatText, log = console.error } = deps;
  return async (input: any, extra: any) => {
    const startTime = Date.now();
    const onProgress = buildCodegenProgressForwarder(extra, log);
    // `extra.signal` aborts when the MCP client cancels or times out the request; forward it so the
    // codegen fetches stop instead of running on (and burning backend credits) after cancellation.
    const perCallTool = createPerCallTool({ onProgress, signal: extra?.signal });

    try {
      const result = await perCallTool.execute(input);
      log(`Executed ${codegenStatic.publicName} in ${Date.now() - startTime}ms`);
      return {
        // Backward-compat: clients ignoring `structuredContent` still need the files in text.
        content: [{ type: 'text' as const, text: formatText(result) }],
        structuredContent: result,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      log(`${codegenStatic.publicName} failed in ${Date.now() - startTime}ms: ${message}`);
      return {
        content: [{ type: 'text' as const, text: message }],
        isError: true,
      };
    }
  };
};
