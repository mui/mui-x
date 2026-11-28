import type * as React from 'react';

function handleKeyDown(event: React.KeyboardEvent) {
  // Space would scroll the page, which it does not do on the other events.
  if (event.key === ' ') {
    event.preventDefault();
  }
}

/**
 * The props of an event rendered as a link.
 */
export function getEventLinkProps(href: string, tabIndex: number) {
  return { href, tabIndex, draggable: false, onKeyDown: handleKeyDown };
}
