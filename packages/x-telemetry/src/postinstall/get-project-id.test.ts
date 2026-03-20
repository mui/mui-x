import { vi, describe, it, expect, beforeEach } from 'vitest';
import path from 'path';

const readFileSyncSpy = vi.fn();

vi.mock('fs', () => ({
  default: { readFileSync: readFileSyncSpy },
  readFileSync: readFileSyncSpy,
}));

describe('getPackageName', () => {
  beforeEach(() => {
    readFileSyncSpy.mockReset();
  });

  it('should return the name from the nearest package.json', async () => {
    readFileSyncSpy.mockReturnValueOnce(JSON.stringify({ name: 'my-app' }));

    const { getPackageName } = await import('./get-project-id');
    expect(getPackageName()).toBe('my-app');
  });

  it('should walk up directories if cwd has no package.json', async () => {
    const cwd = process.cwd();
    const parent = path.dirname(cwd);

    readFileSyncSpy
      .mockImplementationOnce(() => {
        throw new Error('ENOENT');
      })
      .mockReturnValueOnce(JSON.stringify({ name: 'parent-app' }));

    const { getPackageName } = await import('./get-project-id');
    expect(getPackageName()).toBe('parent-app');
    expect(readFileSyncSpy).toHaveBeenCalledWith(path.join(cwd, 'package.json'), 'utf-8');
    expect(readFileSyncSpy).toHaveBeenCalledWith(path.join(parent, 'package.json'), 'utf-8');
  });

  it('should skip package.json without a name field', async () => {
    readFileSyncSpy
      .mockReturnValueOnce(JSON.stringify({ version: '1.0.0' }))
      .mockReturnValueOnce(JSON.stringify({ name: 'root-app' }));

    const { getPackageName } = await import('./get-project-id');
    expect(getPackageName()).toBe('root-app');
  });

  it('should return null if no package.json is found', async () => {
    readFileSyncSpy.mockImplementation(() => {
      throw new Error('ENOENT');
    });

    const { getPackageName } = await import('./get-project-id');
    expect(getPackageName()).toBeNull();
  });
});

describe('getAnonymousProjectId', () => {
  it('should return a valid SHA-256 hex string', async () => {
    const { default: getAnonymousProjectId } = await import('./get-project-id');
    const result = await getAnonymousProjectId();

    expect(result).toMatch(/^[a-f0-9]{64}$/);
  });
});
