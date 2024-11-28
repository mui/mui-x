import * as React from 'react';
import { GridRootPropsContext } from '../../context/GridRootPropsContext';
import { GridContextProvider } from '../../context/GridContextProvider';
import { useDataGridProps } from '../../DataGrid/useDataGridProps';
import { useDataGridComponent } from '../../DataGrid/useDataGridComponent';
import { useGridAriaAttributes } from '../../hooks/utils/useGridAriaAttributes';
import { useGridRowAriaAttributes } from '../../hooks/features/rows/useGridRowAriaAttributes';
import materialSlots from '../../material';

interface DemoContainerProps {
  children: React.ReactNode;
}

const configuration = {
  hooks: {
    useGridAriaAttributes,
    useGridRowAriaAttributes,
  },
};

const contextValue = { slots: materialSlots };

/**
 * WARNING: This is an internal component used in documentation to provide the required context for demos.
 * Please do not use it in your application.
 */
export function DemoContainer(props: DemoContainerProps) {
  const { children } = props;

  const dataGridProps = useDataGridProps({ columns: [] });
  const privateApiRef = useDataGridComponent(dataGridProps.apiRef, dataGridProps);

  return (
    <GridContextProvider
      privateApiRef={privateApiRef}
      configuration={configuration}
      props={dataGridProps}
    >
      <GridRootPropsContext.Provider value={contextValue}>{children}</GridRootPropsContext.Provider>
    </GridContextProvider>
  );
}
