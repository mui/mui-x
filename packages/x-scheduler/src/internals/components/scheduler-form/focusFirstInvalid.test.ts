import { describe, it, expect, afterEach } from 'vitest';
import { focusFirstInvalid } from './focusFirstInvalid';

describe('focusFirstInvalid', () => {
  let container: HTMLElement;

  afterEach(() => {
    container.remove();
  });

  function mount(html: string) {
    container = document.createElement('form');
    container.innerHTML = html;
    document.body.appendChild(container);
    return container;
  }

  it('should focus the first invalid control in document order and select its text', () => {
    const form = mount(`
      <input id="valid" value="ok" />
      <input id="first" aria-invalid="true" value="bad" />
      <input id="second" aria-invalid="true" />
    `);

    expect(focusFirstInvalid(form)).to.equal(true);
    const first = form.querySelector<HTMLInputElement>('#first')!;
    expect(document.activeElement).to.equal(first);
    expect([first.selectionStart, first.selectionEnd]).to.deep.equal([0, 3]);
  });

  it('should skip an aria-hidden invalid control, like the hidden input of a Select', () => {
    const form = mount(`<input aria-hidden="true" tabindex="-1" aria-invalid="true" />`);

    expect(focusFirstInvalid(form)).to.equal(false);
  });

  it('should focus the next visible invalid control after an aria-hidden one', () => {
    const form = mount(`
      <input aria-hidden="true" tabindex="-1" aria-invalid="true" />
      <div id="combobox" role="combobox" tabindex="0" aria-invalid="true"></div>
    `);

    expect(focusFirstInvalid(form)).to.equal(true);
    expect(document.activeElement).to.equal(form.querySelector('#combobox'));
  });

  it('should skip an invalid control inside a hidden ancestor', () => {
    const form = mount(`
      <div hidden><input aria-invalid="true" /></div>
      <input id="visible" aria-invalid="true" />
    `);

    expect(focusFirstInvalid(form)).to.equal(true);
    expect(document.activeElement).to.equal(form.querySelector('#visible'));
  });

  it('should skip a disabled invalid control', () => {
    const form = mount(`
      <input disabled aria-invalid="true" />
      <input id="enabled" aria-invalid="true" />
    `);

    expect(focusFirstInvalid(form)).to.equal(true);
    expect(document.activeElement).to.equal(form.querySelector('#enabled'));
  });

  it('should return false when the only invalid control is hidden', () => {
    const form = mount(`<div hidden><input aria-invalid="true" /></div>`);

    expect(focusFirstInvalid(form)).to.equal(false);
    expect(document.activeElement).to.equal(document.body);
  });

  it('should return false when no control is invalid', () => {
    const form = mount(`<input />`);

    expect(focusFirstInvalid(form)).to.equal(false);
  });
});
