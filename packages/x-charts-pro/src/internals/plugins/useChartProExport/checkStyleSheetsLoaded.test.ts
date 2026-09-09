import { describe, it, expect } from 'vitest';
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
});
