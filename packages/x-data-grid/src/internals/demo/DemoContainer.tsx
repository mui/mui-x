import * as React from 'react';
import { GridRootPropsContext } from '../../context/GridRootPropsContext';
import materialSlots from '../../material';

const contextValue = { slots: materialSlots };

interface DemoContainerProps {
  children: React.ReactNode;
}

/**
 * WARNING: This is an internal component used in documentation to provide the required context for demos.
 * Please do not use it in your application.
 */
export function DemoContainer(props: DemoContainerProps) {
  const { children } = props;

  return (
    <GridRootPropsContext.Provider value={contextValue}>{children}</GridRootPropsContext.Provider>
  );
}
