import { describe, it, expect, afterEach } from 'vitest';
import { getFocusFallback } from './focus-utils';

describe('getFocusFallback', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  function mountEvent(html: string) {
    document.body.innerHTML = html;
    return document.getElementById('event')!;
  }

  it('should return the cell owning the event inside a grid', () => {
    const event = mountEvent(
      '<div role="grid"><div role="gridcell" id="cell" tabindex="0"><div id="event" tabindex="0"></div></div></div>',
    );

    expect(getFocusFallback(event)).to.equal(document.getElementById('cell'));
  });

  it('should not look past the view for a focusable ancestor of the host page', () => {
    const event = mountEvent(
      '<div role="dialog" tabindex="-1"><div role="grid"><div id="event" tabindex="0"></div></div></div>',
    );

    expect(getFocusFallback(event)).to.equal(null);
  });

  it('should return null for an element outside any scheduler view', () => {
    const event = mountEvent('<div tabindex="0"><div id="event" tabindex="0"></div></div>');

    expect(getFocusFallback(event)).to.equal(null);
  });
});
