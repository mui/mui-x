import { describe, expect, it, vi } from 'vitest';
import { createDocsUrlGuard } from './url-guard';

describe('createDocsUrlGuard', () => {
  it.each([
    'https://llms.mui.com/material-ui/llms.txt',
    'https://mui.com/x/react-data-grid/',
    'https://chat-backend.mui.com/v1/public/packages/list',
    'https://material-ui-docs.netlify.app/material-ui/llms.txt',
    'https://6a2a50fd--material-ui-docs.netlify.app/material-ui/llms.txt',
  ])('allows MUI docs origin %s', (url) => {
    expect(createDocsUrlGuard([])(url)).toBe(true);
  });

  it.each([
    'http://mui.com/x', // built-in MUI hosts must be https, not cleartext
    'http://llms.mui.com/material-ui/llms.txt',
    'http://localhost:5002/',
    'http://127.0.0.1/admin',
    'http://169.254.169.254/latest/meta-data/',
    'http://[::ffff:127.0.0.1]/', // IPv4-mapped loopback
    'http://localhost.:5002/admin', // trailing DNS dot
    'https://example.com/', // arbitrary public host is NOT allowed under the allowlist
    'https://evil-mui.com/', // lookalike
    'https://mui.com.evil.com/', // suffix-spoof attempt
    'https://evilmaterial-ui-docs.netlify.app/', // different netlify site, not a MUI preview
  ])('blocks non-MUI host %s', (url) => {
    expect(createDocsUrlGuard([])(url)).toBe(false);
  });

  it('allows an explicitly configured origin even when it is localhost (dev backend)', () => {
    const guard = createDocsUrlGuard(['http://localhost:5003']);
    expect(guard('http://localhost:5003/v1/public/packages/list')).toBe(true);
    // A different localhost port is still blocked.
    expect(guard('http://localhost:9999/')).toBe(false);
  });

  it('rejects non-HTTP(S) schemes and malformed URLs', () => {
    const guard = createDocsUrlGuard([]);
    expect(guard('file:///etc/passwd')).toBe(false);
    expect(guard('not a url')).toBe(false);
  });

  it('ignores a non-HTTP(S) configured origin (no opaque-origin bypass)', () => {
    // A misconfigured file:// origin must not enter the allowlist; otherwise every other
    // opaque-origin URL (which also serializes to "null") would be accepted.
    const guard = createDocsUrlGuard(['file:///tmp/docs']);
    expect(guard('file:///etc/passwd')).toBe(false);
    expect(guard('data:text/html,<script>alert(1)</script>')).toBe(false);
  });

  it('logs each dropped configured origin (bad scheme or malformed)', () => {
    const logger = vi.fn();
    createDocsUrlGuard(['file:///tmp/docs', 'not a url', 'http://localhost:5003'], logger);
    // file:// (unsupported scheme) and 'not a url' (malformed) are logged; the valid one isn't.
    expect(logger).toHaveBeenCalledTimes(2);
  });
});
