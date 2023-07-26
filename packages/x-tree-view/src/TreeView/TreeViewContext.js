import * as React from 'react';

/**
 * @ignore - internal component.
 */
export const TreeViewContext = React.createContext({});

if (process.env.NODE_ENV !== 'production') {
  TreeViewContext.displayName = 'TreeViewContext';
}
