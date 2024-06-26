// https://www.abeautifulsite.net/posts/finding-the-active-element-in-a-shadow-root/
export const getActiveElement = (root: Document | ShadowRoot = document): Element | null => {
  const activeEl = root.activeElement;

  if (!activeEl) {
    return null;
  }

  if (activeEl.shadowRoot) {
    return getActiveElement(activeEl.shadowRoot);
  }

  return activeEl;
};

// TODO, eventually replaces this function with CSS.escape, once available in jsdom, either added manually or built in
// https://github.com/jsdom/jsdom/issues/1550#issuecomment-236734471
export function escapeOperandAttributeSelector(operand: string): string {
  return operand.replace(/["\\]/g, '\\$&');
}
