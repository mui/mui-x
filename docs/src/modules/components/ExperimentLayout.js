import * as React from 'react';

// eslint-disable-next-line react/prop-types
export function ExperimentLayout({ children }) {
  return (
    <React.Fragment>
      <style>{'body { margin: 0; }'}</style>
      <div style={{ display: 'flex', height: '100dvh', boxSizing: 'border-box' }}>{children}</div>
    </React.Fragment>
  );
}
