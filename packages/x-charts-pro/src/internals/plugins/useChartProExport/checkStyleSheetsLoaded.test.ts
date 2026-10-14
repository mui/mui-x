import { describe, it, expect, onTestFinished } from 'vitest';
import { isJSDOM } from 'test/utils/skipIf';
import { checkStyleSheetsLoaded } from './exportImage';

describe('checkStyleSheetsLoaded', () => {
  function createDocumentWithStyle(textContent: string, sheet: CSSStyleSheet | null) {
    const exportDocument = document.implementation.createHTMLDocument('');
    const style = exportDocument.createElement('style');
    style.textContent = textContent;
    exportDocument.head.appendChild(style);
    /* A style element blocked by the Content Security Policy is in the document but has no sheet. */
    Object.defineProperty(style, 'sheet', { get: () => sheet });
    return exportDocument;
  }

  it('throws when a style was blocked', () => {
    const exportDocument = createDocumentWithStyle('body { margin: 0; }', null);

    expect(() => checkStyleSheetsLoaded(exportDocument)).to.throw(/Content Security Policy/);
  });

  it('points to the `nonce` and `copyStyles` options', () => {
    const exportDocument = createDocumentWithStyle('body { margin: 0; }', null);

    expect(() => checkStyleSheetsLoaded(exportDocument)).to.throw(/nonce/);
    expect(() => checkStyleSheetsLoaded(exportDocument)).to.throw(/copyStyles/);
  });

  it('does not throw when the styles were applied', () => {
    const exportDocument = createDocumentWithStyle('body { margin: 0; }', {} as CSSStyleSheet);

    expect(() => checkStyleSheetsLoaded(exportDocument)).not.to.throw();
  });

  it('does not throw for an empty style element', () => {
    const exportDocument = createDocumentWithStyle('', null);

    expect(() => checkStyleSheetsLoaded(exportDocument)).not.to.throw();
  });

  /* JSDOM doesn't enforce a Content Security Policy, so only a browser shows that a blocked style has no sheet. */
  describe.skipIf(isJSDOM)('with a real Content Security Policy', () => {
    function createBlockedDocument(nonce?: string) {
      const iframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      onTestFinished(() => iframe.remove());
      const exportDocument = iframe.contentDocument!;
      const meta = exportDocument.createElement('meta');
      meta.httpEquiv = 'Content-Security-Policy';
      meta.content = "style-src 'nonce-export'";
      exportDocument.head.appendChild(meta);
      const style = exportDocument.createElement('style');
      if (nonce) {
        style.setAttribute('nonce', nonce);
      }
      style.textContent = 'body { margin: 0; }';
      exportDocument.head.appendChild(style);
      return exportDocument;
    }

    it('throws when the policy blocks a copied style', () => {
      expect(() => checkStyleSheetsLoaded(createBlockedDocument())).to.throw(
        /Content Security Policy/,
      );
    });

    it('does not throw when the copied style carries the nonce', () => {
      expect(() => checkStyleSheetsLoaded(createBlockedDocument('export'))).not.to.throw();
    });
  });
});
