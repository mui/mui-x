import path from 'path';

export function getWorkspaceRoot() {
  const workspaceRoot = path.resolve(import.meta.dirname, '..');
  return workspaceRoot;
}
