export {}; // Ensure this file is treated as a module to avoid global scope TS error

declare global {
  interface MUIEnv {
    NODE_ENV?: string;
  }

  interface Process {
    env: MUIEnv;
  }

  // support process.env.NODE_ENV === '...'
  // @ts-ignore
  const process: Process;
}
