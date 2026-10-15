import { vi, describe, it, expect, onTestFinished } from 'vitest';
import { loadStyleSheets } from '@mui/x-internals/export';
import { isJSDOM } from 'test/utils/skipIf';

/* JSDOM doesn't enforce a Content Security Policy or load stylesheets. */
describe.skipIf(isJSDOM)('onStylesheetError reason', () => {
  function createExportDocument(csp?: string) {
    const iframe = document.createElement('iframe');
    document.body.appendChild(iframe);
    onTestFinished(() => iframe.remove());
    const exportDocument = iframe.contentDocument!;
    if (csp) {
      const meta = exportDocument.createElement('meta');
      meta.httpEquiv = 'Content-Security-Policy';
      meta.content = csp;
      exportDocument.head.appendChild(meta);
    }
    return exportDocument;
  }

  function createSourceDocument(href: string) {
    const sourceDocument = document.implementation.createHTMLDocument('');
    sourceDocument.head.innerHTML = `<link rel="stylesheet" href="${href}" />`;
    return sourceDocument;
  }

  it('is `content-security-policy` when the Content Security Policy blocks the stylesheet', async () => {
    const onStylesheetError = vi.fn();

    await Promise.all(
      loadStyleSheets(
        createExportDocument("style-src 'nonce-export'"),
        createSourceDocument(`${window.location.origin}/blocked-stylesheet.css`),
        { onStylesheetError },
      ),
    );

    expect(onStylesheetError.mock.calls.length).to.equal(1);
    expect(onStylesheetError.mock.calls[0][1]).to.equal('content-security-policy');
  });

  it('is `load-error` when the stylesheet fails to load', async () => {
    const onStylesheetError = vi.fn();

    await Promise.all(
      loadStyleSheets(
        createExportDocument(),
        createSourceDocument(`${window.location.origin}/missing-stylesheet.css`),
        { onStylesheetError },
      ),
    );

    expect(onStylesheetError.mock.calls.length).to.equal(1);
    expect(onStylesheetError.mock.calls[0][1]).to.equal('load-error');
  });
});
