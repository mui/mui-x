import { describe, expect, it, vi } from 'vitest';
import { buildCombinedLogger, DEFAULT_LOG_PATH, MAX_LOG_BYTES } from './logger';

describe('buildCombinedLogger', () => {
  it('writes to both stderr (console) AND the log file', () => {
    const consoleErr = vi.fn();
    const appendFile = vi.fn();
    const log = buildCombinedLogger('/tmp/test.log', consoleErr, appendFile);

    log('something happened', new Error('boom'));

    expect(consoleErr).toHaveBeenCalledWith('something happened', expect.any(Error));
    expect(appendFile).toHaveBeenCalledTimes(1);
    expect(appendFile.mock.calls[0][0]).toBe('/tmp/test.log');
    // ISO timestamp + message + stack (or message fallback).
    expect(appendFile.mock.calls[0][1]).toMatch(
      /^\[\d{4}-\d{2}-\d{2}T[\d:.Z]+\] something happened.*boom/,
    );
  });

  it('still writes the message when there is no error attached', () => {
    const consoleErr = vi.fn();
    const appendFile = vi.fn();
    const log = buildCombinedLogger('/tmp/test.log', consoleErr, appendFile);

    log('just a note');

    expect(consoleErr).toHaveBeenCalledWith('just a note', undefined);
    expect(appendFile.mock.calls[0][1]).toMatch(/just a note\n$/);
  });

  it('surfaces file-write failures via consoleErr without crashing the MCP', () => {
    const consoleErr = vi.fn();
    const appendFile = vi.fn(() => {
      throw new Error('EACCES: permission denied');
    });
    const log = buildCombinedLogger('/readonly/path.log', consoleErr, appendFile);

    expect(() => log('something happened')).not.toThrow();

    // 1: the original message. 2: the "log file write failed" note so users aren't blind.
    expect(consoleErr).toHaveBeenCalledTimes(2);
    expect(consoleErr.mock.calls[1][0]).toMatch(/log file write failed.*\/readonly\/path\.log/);
    expect(consoleErr.mock.calls[1][1]).toBeInstanceOf(Error);
  });

  it('defaults to ~/.mui-mcp.log when no path is passed', () => {
    expect(DEFAULT_LOG_PATH).toMatch(/\.mui-mcp\.log$/);
  });

  it('truncates the log file on construction when it exceeds the size cap', () => {
    const truncate = vi.fn();
    buildCombinedLogger('/tmp/big.log', vi.fn(), vi.fn(), {
      statSize: () => MAX_LOG_BYTES + 1,
      truncate,
    });

    expect(truncate).toHaveBeenCalledWith('/tmp/big.log');
  });

  it('leaves a log file under the cap untouched', () => {
    const truncate = vi.fn();
    buildCombinedLogger('/tmp/small.log', vi.fn(), vi.fn(), {
      statSize: () => 10,
      truncate,
    });

    expect(truncate).not.toHaveBeenCalled();
  });

  it('never throws when the log file cannot be stat-ed (e.g. first run)', () => {
    const truncate = vi.fn();
    expect(() =>
      buildCombinedLogger('/tmp/missing.log', vi.fn(), vi.fn(), {
        statSize: () => {
          throw new Error('ENOENT');
        },
        truncate,
      }),
    ).not.toThrow();
    expect(truncate).not.toHaveBeenCalled();
  });
});
