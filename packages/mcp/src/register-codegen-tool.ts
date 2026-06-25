import type { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { buildCodegenHandler } from './codegen-handler';

type Logger = (message: string, error?: unknown) => void;

type CodegenStaticTool = {
  publicName: string;
  description: string;
  inputSchema: unknown;
  outputSchema: unknown;
};

type CodegenHandlerDeps = Parameters<typeof buildCodegenHandler>[0];

export interface RegisterCodegenToolDeps {
  codegenStatic: CodegenStaticTool;
  createPerCallTool: CodegenHandlerDeps['createPerCallTool'];
  formatText: CodegenHandlerDeps['formatText'];
  logger: Logger;
}

/**
 * Register the `generateReactCode` tool on the MCP server. Unlike the docs tools, this needs no
 * network at startup, so it always registers. Both the input and output schemas are advertised so
 * clients can discover and validate the structured result the handler returns.
 */
export function registerCodegenTool(server: McpServer, deps: RegisterCodegenToolDeps): void {
  const { codegenStatic, createPerCallTool, formatText, logger } = deps;

  server.registerTool(
    codegenStatic.publicName,
    {
      description: codegenStatic.description,
      inputSchema: (codegenStatic.inputSchema as z.AnyZodObject).shape,
      // Advertise the structured output (files, threadId, muiPairing) so clients can discover and
      // validate it; the handler returns a matching `structuredContent` on success.
      outputSchema: (codegenStatic.outputSchema as z.AnyZodObject).shape,
    },
    buildCodegenHandler({
      codegenStatic,
      createPerCallTool,
      formatText,
      log: logger,
    }),
  );
}
