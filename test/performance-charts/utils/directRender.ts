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
  };
};
