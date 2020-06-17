import React from 'react';
import { DocsContainer } from '@storybook/addon-docs/blocks';

export const SizeContainer = ({ children, context }) => (
  <DocsContainer context={context}>
    <div style={{ width: 600, height: 800, border: '1px solid red' }}>{children}</div>
  </DocsContainer>
);
