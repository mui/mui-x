import { describe, it, expect, beforeEach, vi } from 'vitest';
import { clearWarningsCache } from '../warning';
import { loadStyleSheets } from './loadStyleSheets';

describe('loadStyleSheets', () => {
  beforeEach(() => clearWarningsCache());

  function createTargetDocument() {
    return document.implementation.createHTMLDocument('');
  }

  function dispatchError(targetDocument: Document) {
    targetDocument.head.querySelectorAll('link').forEach((link) => {
      link.dispatchEvent(new Event('error'));
    });
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
    await expect(async () => {
      dispatchError(targetDocument);
      await expect(Promise.all(promises)).resolves.to.deep.equal([true]);
    }).toWarnDev(
      'MUI X: The stylesheet "https://example.com/missing.css", or a stylesheet it imports, failed to load in the export document.',
    );
  });

  it('calls onStylesheetError instead of warning when a stylesheet fails to load', async () => {
    const targetDocument = createTargetDocument();
    const sourceDocument = createSourceDocument(
      '<link rel="stylesheet" href="https://example.com/missing.css" />',
    );
    const onStylesheetError = vi.fn();

    const promises = loadStyleSheets(targetDocument, sourceDocument, { onStylesheetError });
    dispatchError(targetDocument);

    await expect(Promise.all(promises)).resolves.to.deep.equal([true]);
    expect(onStylesheetError.mock.calls.length).to.equal(1);
    expect(onStylesheetError.mock.calls[0][0].href).to.equal('https://example.com/missing.css');
  });

  it('resolves to false when onStylesheetError returns false', async () => {
    const targetDocument = createTargetDocument();
    const sourceDocument = createSourceDocument(
      '<link rel="stylesheet" href="https://example.com/missing.css" />',
    );

    const promises = loadStyleSheets(targetDocument, sourceDocument, {
      onStylesheetError: () => false,
    });
    dispatchError(targetDocument);

    await expect(Promise.all(promises)).resolves.to.deep.equal([false]);
  });

  it('resolves to false when onStylesheetError resolves to false', async () => {
    const targetDocument = createTargetDocument();
    const sourceDocument = createSourceDocument(
      '<link rel="stylesheet" href="https://example.com/missing.css" />',
    );

    const promises = loadStyleSheets(targetDocument, sourceDocument, {
      onStylesheetError: () => Promise.resolve(false),
    });
    dispatchError(targetDocument);

    await expect(Promise.all(promises)).resolves.to.deep.equal([false]);
  });

  it('rejects when onStylesheetError throws', async () => {
    const targetDocument = createTargetDocument();
    const sourceDocument = createSourceDocument(
      '<link rel="stylesheet" href="https://example.com/missing.css" />',
    );
    const onStylesheetError = () => {
      throw new Error('Stop the export');
    };

    const promises = loadStyleSheets(targetDocument, sourceDocument, { onStylesheetError });
    dispatchError(targetDocument);

    await expect(Promise.all(promises)).rejects.toThrow('Stop the export');
  });

  it('rejects when onStylesheetError rejects', async () => {
    const targetDocument = createTargetDocument();
    const sourceDocument = createSourceDocument(
      '<link rel="stylesheet" href="https://example.com/missing.css" />',
    );
    const onStylesheetError = () => Promise.reject(new Error('Stop the export'));

    const promises = loadStyleSheets(targetDocument, sourceDocument, { onStylesheetError });
    dispatchError(targetDocument);

    await expect(Promise.all(promises)).rejects.toThrow('Stop the export');
  });

  it('waits for onStylesheetError to resolve before resolving', async () => {
    const targetDocument = createTargetDocument();
    const sourceDocument = createSourceDocument(
      '<link rel="stylesheet" href="https://example.com/missing.css" />',
    );
    let resolveCallback!: () => void;
    const onStylesheetError = () =>
      new Promise<void>((resolve) => {
        resolveCallback = resolve;
      });
    let settled = false;

    const promises = loadStyleSheets(targetDocument, sourceDocument, { onStylesheetError });
    const allPromise = Promise.all(promises).then(() => {
      settled = true;
    });
    dispatchError(targetDocument);
    await Promise.resolve();
    await Promise.resolve();

    expect(settled).to.equal(false);

    resolveCallback();
    await allPromise;

    expect(settled).to.equal(true);
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

    await expect(Promise.all(promises)).resolves.to.deep.equal([true]);
  });

  it('sets the nonce on the copied elements', () => {
    const targetDocument = createTargetDocument();
    const sourceDocument = createSourceDocument(
      '<style>body { margin: 0; }</style><link rel="stylesheet" href="https://example.com/styles.css" />',
    );

    loadStyleSheets(targetDocument, sourceDocument, { nonce: 'the-nonce' });

    const nonces = Array.from(targetDocument.head.querySelectorAll<HTMLElement>('style, link')).map(
      (element) => element.nonce || element.getAttribute('nonce'),
    );

    expect(nonces).to.deep.equal(['the-nonce', 'the-nonce']);
  });
});
