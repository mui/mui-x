import * as React from 'react';

const GridRootPropsContext = React.createContext<unknown>(undefined);

if (process.env.NODE_ENV !== 'production') {
  GridRootPropsContext.displayName = 'GridRootPropsContext';
}

export { GridRootPropsContext };
