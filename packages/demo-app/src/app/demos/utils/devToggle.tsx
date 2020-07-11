import * as React from 'react';

const isDev = process.env.NODE_ENV !== 'production';

export const DevToggle: React.FC = ({ children }) => {
  if (isDev) {
    return <React.Fragment>{children}</React.Fragment>;
  }

  return null;
};
