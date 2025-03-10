import * as ReactDOM from 'react-dom/client';
import * as React from 'react';
// eslint-disable-next-line no-restricted-imports
import { screen } from '@testing-library/react';

export const directRender = (fn: React.JSX.Element) => {
  const root = document.createElement('div');
  root.id = 'root';
  document.body.appendChild(root);
  const reactRoot = ReactDOM.createRoot(document.querySelector('#root')!);

  reactRoot.render(fn);

  return {
    unmount: () => reactRoot.unmount(),
    ...screen,
    // findByText: async (text: string) => {
    //   const el = document.querySelector(
    //     `#root *:not(script):not(style):not(link):not(meta):not(title):not(base):not(template):not(noscript):not(head):not(html):not(body):not(#root)`,
    //   );
    //   if (!el) {
    //     throw new Error('Element not found');
    //   }
    //   if (!el.textContent) {
    //     throw new Error('Element has no text content');
    //   }
    //   if (!el.textContent.includes(text)) {
    //     throw new Error('Text not found');
    //   }
    //   return el;
    // },
  };
};
