import { describe, it, expect, afterEach } from 'vitest';
import { getStyleNonce } from './getStyleNonce';

describe('getStyleNonce', () => {
  const createdElements: Element[] = [];

  function appendToHead<T extends Element>(element: T): T {
    document.head.appendChild(element);
    createdElements.push(element);
    return element;
  }

  afterEach(() => {
    createdElements.forEach((element) => element.remove());
    createdElements.length = 0;
  });

  it('returns undefined when no style element has a nonce', () => {
    const style = document.createElement('style');
    style.textContent = 'body { margin: 0; }';
    appendToHead(style);

    expect(getStyleNonce(document)).to.equal(undefined);
  });

  it('returns the nonce of a style element', () => {
    const style = document.createElement('style');
    style.setAttribute('nonce', 'style-nonce');
    appendToHead(style);

    expect(getStyleNonce(document)).to.equal('style-nonce');
  });

  it('returns the nonce of a stylesheet link', () => {
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('nonce', 'link-nonce');
    appendToHead(link);

    expect(getStyleNonce(document)).to.equal('link-nonce');
  });

  it('ignores elements that are not styles', () => {
    const script = document.createElement('script');
    script.setAttribute('nonce', 'script-nonce');
    appendToHead(script);

    expect(getStyleNonce(document)).to.equal(undefined);
  });

  it('reads the nonce from a shadow root', () => {
    const host = appendToHead(document.createElement('div'));
    const shadowRoot = host.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.setAttribute('nonce', 'shadow-nonce');
    shadowRoot.appendChild(style);

    expect(getStyleNonce(shadowRoot)).to.equal('shadow-nonce');
  });
});
