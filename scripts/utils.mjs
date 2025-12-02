import path from 'path';

/**
 * Returns the full path of the root directory of this repository.
 */
export function getWorkspaceRoot() {
  const workspaceRoot = path.resolve(import.meta.dirname, '..');
  return workspaceRoot;
}
