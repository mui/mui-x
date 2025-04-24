export {}; // Ensure this file is treated as a module to avoid global scope TS error

declare global {
  // support process.env.NODE_ENV === '...'
  const process: {
    env: {
      NODE_ENV?: string;
      [key: string]: string | undefined;
    };
  };
}
