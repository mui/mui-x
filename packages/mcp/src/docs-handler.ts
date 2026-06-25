/** Per-request handler for the docs tools: log duration, wrap text in MCP `content` shape. */
export const buildDocsHandler = (
  tool: { publicName: string; execute: (input: any) => Promise<string> },
  log: (message: string) => void = console.error,
) => {
  return async (input: any) => {
    const startTime = Date.now();
    const text = await tool.execute(input);
    log(`Executed ${tool.publicName} in ${Date.now() - startTime}ms`);
    return { content: [{ type: 'text' as const, text }] };
  };
};
