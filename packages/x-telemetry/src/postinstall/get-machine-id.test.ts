import { vi, describe, it, expect, beforeEach } from 'vitest';
import { createHash } from 'crypto';

const readFileSyncSpy = vi.fn();

vi.mock('fs', () => ({
  default: { readFileSync: readFileSyncSpy },
  readFileSync: readFileSyncSpy,
}));

vi.mock('node-machine-id', () => ({
  machineId: vi.fn(),
}));

function sha256(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

describe('getAnonymousMachineId', () => {
  beforeEach(() => {
    readFileSyncSpy.mockReset();
    vi.resetModules();
  });

  it('should use node-machine-id when available', async () => {
    const nodeMachineId = await import('node-machine-id');
    vi.mocked(nodeMachineId.machineId).mockResolvedValueOnce('test-machine-id');

    const { default: getAnonymousMachineId } = await import('./get-machine-id');
    const result = await getAnonymousMachineId();

    expect(result).toBe(sha256('test-machine-id'));
  });

  it('should fall back to /etc/machine-id when node-machine-id fails', async () => {
    const nodeMachineId = await import('node-machine-id');
    vi.mocked(nodeMachineId.machineId).mockRejectedValueOnce(new Error('not available'));
    readFileSyncSpy.mockReturnValueOnce('etc-machine-id-value\n');

    const { default: getAnonymousMachineId } = await import('./get-machine-id');
    const result = await getAnonymousMachineId();

    expect(result).toBe(sha256('etc-machine-id-value'));
    expect(readFileSyncSpy).toHaveBeenCalledWith('/etc/machine-id', 'utf-8');
  });

  it('should fall back to /var/lib/dbus/machine-id', async () => {
    const nodeMachineId = await import('node-machine-id');
    vi.mocked(nodeMachineId.machineId).mockRejectedValueOnce(new Error('not available'));
    readFileSyncSpy
      .mockImplementationOnce(() => {
        throw new Error('ENOENT');
      })
      .mockReturnValueOnce('dbus-machine-id-value\n');

    const { default: getAnonymousMachineId } = await import('./get-machine-id');
    const result = await getAnonymousMachineId();

    expect(result).toBe(sha256('dbus-machine-id-value'));
    expect(readFileSyncSpy).toHaveBeenCalledWith('/var/lib/dbus/machine-id', 'utf-8');
  });

  it('should fall back to os.hostname() on non-Linux platforms', async () => {
    const nodeMachineId = await import('node-machine-id');
    vi.mocked(nodeMachineId.machineId).mockRejectedValueOnce(new Error('not available'));
    readFileSyncSpy.mockImplementation(() => {
      throw new Error('ENOENT');
    });

    const originalPlatform = process.platform;
    Object.defineProperty(process, 'platform', { value: 'darwin', writable: true });

    const { default: getAnonymousMachineId } = await import('./get-machine-id');
    const result = await getAnonymousMachineId();

    Object.defineProperty(process, 'platform', { value: originalPlatform, writable: true });

    // os.hostname() returns a value on any real machine, so result should be a valid hash
    expect(result).toMatch(/^[a-f0-9]{64}$/);
  });

  it('should skip os.hostname() on Linux', async () => {
    const nodeMachineId = await import('node-machine-id');
    vi.mocked(nodeMachineId.machineId).mockRejectedValueOnce(new Error('not available'));
    readFileSyncSpy.mockImplementation(() => {
      throw new Error('ENOENT');
    });

    const originalPlatform = process.platform;
    Object.defineProperty(process, 'platform', { value: 'linux', writable: true });

    const { default: getAnonymousMachineId } = await import('./get-machine-id');
    const result = await getAnonymousMachineId();

    Object.defineProperty(process, 'platform', { value: originalPlatform, writable: true });

    expect(result).toBeNull();
  });

  it('should return null when all fallbacks fail', async () => {
    const nodeMachineId = await import('node-machine-id');
    vi.mocked(nodeMachineId.machineId).mockRejectedValueOnce(new Error('not available'));
    readFileSyncSpy.mockImplementation(() => {
      throw new Error('ENOENT');
    });

    const originalPlatform = process.platform;
    Object.defineProperty(process, 'platform', { value: 'linux', writable: true });

    const { default: getAnonymousMachineId } = await import('./get-machine-id');
    const result = await getAnonymousMachineId();

    Object.defineProperty(process, 'platform', { value: originalPlatform, writable: true });

    expect(result).toBeNull();
  });

  it('should return a valid SHA-256 hex string', async () => {
    const nodeMachineId = await import('node-machine-id');
    vi.mocked(nodeMachineId.machineId).mockResolvedValueOnce('any-id');

    const { default: getAnonymousMachineId } = await import('./get-machine-id');
    const result = await getAnonymousMachineId();

    expect(result).toMatch(/^[a-f0-9]{64}$/);
  });

  it('should trim whitespace from file-based machine IDs', async () => {
    const nodeMachineId = await import('node-machine-id');
    vi.mocked(nodeMachineId.machineId).mockRejectedValueOnce(new Error('not available'));
    readFileSyncSpy.mockReturnValueOnce('  machine-id-with-spaces  \n');

    const { default: getAnonymousMachineId } = await import('./get-machine-id');
    const result = await getAnonymousMachineId();

    expect(result).toBe(sha256('machine-id-with-spaces'));
  });
});
