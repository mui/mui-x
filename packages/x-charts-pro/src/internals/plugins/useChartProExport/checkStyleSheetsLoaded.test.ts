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
    function createPolicyDocument() {
      const iframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      onTestFinished(() => iframe.remove());
      const exportDocument = iframe.contentDocument!;
      const meta = exportDocument.createElement('meta');
      meta.httpEquiv = 'Content-Security-Policy';
      meta.content = "style-src 'nonce-export'";
      exportDocument.head.appendChild(meta);
      return exportDocument;
    }

    function createBlockedDocument(nonce?: string) {
      const exportDocument = createPolicyDocument();
      const style = exportDocument.createElement('style');
      if (nonce) {
        style.setAttribute('nonce', nonce);
      }
      style.textContent = 'body { margin: 0; }';
      exportDocument.head.appendChild(style);
      return exportDocument;
    }

    function createLinkDocument() {
      const exportDocument = createPolicyDocument();
      const link = exportDocument.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'data:text/css,';
      exportDocument.head.appendChild(link);
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

    it('throws when the policy blocks the style that inlines a stylesheet link', () => {
      expect(() => checkStyleSheetsLoaded(createLinkDocument())).to.throw(/`nonce` export option/);
    });

    it('does not throw for a stylesheet link when the nonce is provided', () => {
      expect(() => checkStyleSheetsLoaded(createLinkDocument(), 'export')).not.to.throw();
    });

    it('does not throw without a stylesheet link', () => {
      expect(() => checkStyleSheetsLoaded(createPolicyDocument())).not.to.throw();
    });

    it('does not leave the style used for the check in the document', () => {
      const exportDocument = createLinkDocument();

      checkStyleSheetsLoaded(exportDocument, 'export');

      expect(exportDocument.querySelector('style')).to.equal(null);
    });
  });
});
