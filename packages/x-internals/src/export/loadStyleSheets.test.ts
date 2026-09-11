import { describe, it, expect, beforeEach } from 'vitest';
import { clearWarningsCache } from '../warning';
import { loadStyleSheets } from './loadStyleSheets';

describe('loadStyleSheets', () => {
  beforeEach(() => clearWarningsCache());

  function createTargetDocument() {
    return document.implementation.createHTMLDocument('');
  }

  function createSourceDocument(head: string) {
    const sourceDocument = document.implementation.createHTMLDocument('');
    sourceDocument.head.innerHTML = head;
    return sourceDocument;
  }

  it('resolves when a stylesheet fails to load', async () => {
    const targetDocument = createTargetDocument();
    const sourceDocument = createSourceDocument(
      '<link rel="stylesheet" href="https://example.com/missing.css" />',
    );

    const promises = loadStyleSheets(targetDocument, sourceDocument);

    expect(promises.length).to.equal(1);

    /* A stylesheet blocked by the Content Security Policy fires `error` instead of `load`. */
    expect(() => {
      targetDocument.head.querySelectorAll('link').forEach((link) => {
        link.dispatchEvent(new Event('error'));
      });
    }).toWarnDev(
      'MUI X: Failed to load the stylesheet "https://example.com/missing.css" in the export document.',
    );

    await expect(Promise.all(promises)).resolves.toBeDefined();
  });

  it('resolves when a stylesheet loads', async () => {
    const targetDocument = createTargetDocument();
    const sourceDocument = createSourceDocument(
      '<link rel="stylesheet" href="https://example.com/styles.css" />',
    );

    const promises = loadStyleSheets(targetDocument, sourceDocument);

    targetDocument.head.querySelectorAll('link').forEach((link) => {
      link.dispatchEvent(new Event('load'));
    });

    await expect(Promise.all(promises)).resolves.toBeDefined();
  });

  it('sets the nonce on the copied elements', () => {
    const targetDocument = createTargetDocument();
    const sourceDocument = createSourceDocument(
      '<style>body { margin: 0; }</style><link rel="stylesheet" href="https://example.com/styles.css" />',
    );

    loadStyleSheets(targetDocument, sourceDocument, 'the-nonce');

    const nonces = Array.from(targetDocument.head.querySelectorAll<HTMLElement>('style, link')).map(
      (element) => element.nonce || element.getAttribute('nonce'),
    );

    expect(nonces).to.deep.equal(['the-nonce', 'the-nonce']);
  });
});
