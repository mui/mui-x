import path from 'path';

/**
 * Returns the full path of the root directory of this repository.
 */
// eslint-disable-next-line import/prefer-default-export
export function getWorkspaceRoot() {
  const workspaceRoot = path.resolve(import.meta.dirname, '..');
  return workspaceRoot;
}
