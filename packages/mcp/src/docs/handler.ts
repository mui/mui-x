/** Per-request handler for the docs tools: log duration, wrap text in MCP `content` shape. */
export const buildDocsHandler = (
  tool: {
    publicName: string;
    execute: (input: any, context?: { signal?: AbortSignal }) => Promise<string>;
  },
  log: (message: string) => void = console.error,
) => {
  return async (input: any, extra?: any) => {
    const startTime = Date.now();
    // Forward the request abort signal so the docs fetches stop on cancel.
    const text = await tool.execute(input, { signal: extra?.signal });
    log(`Executed ${tool.publicName} in ${Date.now() - startTime}ms`);
    return { content: [{ type: 'text' as const, text }] };
  };
};
