import * as React from 'react';

const isDev = process.env.NODE_ENV !== 'production';

export function DevToggle(props) {
  if (isDev) {
    return <React.Fragment>{props.children}</React.Fragment>;
  }

  return null;
}
