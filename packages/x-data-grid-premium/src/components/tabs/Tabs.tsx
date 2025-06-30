'use client';
import * as React from 'react';
import { styled } from '@mui/system';
import { vars } from '@mui/x-data-grid-pro/internals';
import { getDataGridUtilityClass } from '@mui/x-data-grid-pro';
import composeClasses from '@mui/utils/composeClasses';
import clsx from 'clsx';
import { TabsContext } from './TabsContext';
import { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

type TabsProps = React.HTMLAttributes<HTMLDivElement> & {
  initialTab: string;
};
type TabListProps = React.HTMLAttributes<HTMLDivElement>;

type OwnerState = Pick<DataGridPremiumProcessedProps, 'classes'>;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['tabs'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const TabsRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'Tabs',
})(() => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
}));

const TabListRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'TabsTabList',
})({
  display: 'flex',
  borderBottom: `1px solid ${vars.colors.border.base}`,
  background: vars.colors.background.base,
});

function Tabs(props: TabsProps) {
  const { initialTab, className, children, ...other } = props;
  const [activeTab, setActiveTab] = React.useState<string>(initialTab);
  const rootProps = useGridRootProps();
  const ownerState = { classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  const contextValue = React.useMemo(
    () => ({ activeTab, setActiveTab }),
    [activeTab, setActiveTab],
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <TabsRoot className={clsx(classes.root, className)} {...other}>
        {children}
      </TabsRoot>
    </TabsContext.Provider>
  );
}

function TabList(props: TabListProps) {
  const { className, children, ...other } = props;
  const rootProps = useGridRootProps();
  const ownerState = { classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  return (
    <TabListRoot role="tablist" className={clsx(classes.root, className)} {...other}>
      {children}
    </TabListRoot>
  );
}

export { Tabs, TabList };
