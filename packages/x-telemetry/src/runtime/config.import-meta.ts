const importMetaEnv: Record<string, string> | undefined =
  typeof (import.meta as any)?.env === 'object' ? (import.meta as any).env : undefined;

export { importMetaEnv };
