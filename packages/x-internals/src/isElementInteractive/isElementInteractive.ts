/**
 * Taken from https://github.com/matijs/is-interactive-element/
 */
const isInputHidden = (input: HTMLInputElement) => input.type === 'hidden';

export function isElementInteractive(element: HTMLElement) {
  const { nodeName } = element;

  if (
    ['BUTTON', 'DETAILS', 'EMBED', 'IFRAME', 'KEYGEN', 'LABEL', 'SELECT', 'TEXTAREA'].includes(
      nodeName,
    )
  ) {
    return true;
  }

  if (nodeName === 'A' && element.hasAttribute('href')) {
    return true;
  }

  if (element instanceof HTMLInputElement && !isInputHidden(element)) {
    return true;
  }

  if (['AUDIO', 'VIDEO'].includes(nodeName) && element.hasAttribute('controls')) {
    return true;
  }

  if (['IMG', 'OBJECT'].includes(nodeName) && element.hasAttribute('usemap')) {
    return true;
  }

  if (element.hasAttribute('tabindex') && element.tabIndex > -1) {
    return true;
  }

  return false;
}
