import * as React from 'react';
import { styled } from '@mui/system';
import { vars } from '@mui/x-data-grid-pro/internals';
import composeClasses from '@mui/utils/composeClasses';
import { getDataGridUtilityClass } from '@mui/x-data-grid-pro';
import clsx from 'clsx';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';
import { useTabsContext } from './TabsContext';

export type TabPanelProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string;
};

type OwnerState = Pick<DataGridPremiumProcessedProps, 'classes'>;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['tabPanel'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const TabPanelRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'TabPanel',
})(() => ({
  background: vars.colors.background.base,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
}));

function TabPanel(props: TabPanelProps) {
  const { value, children, className, ...other } = props;
  const rootProps = useGridRootProps();
  const { activeTab } = useTabsContext();
  const ownerState = { classes: rootProps.classes };
  const classes = useUtilityClasses(ownerState);

  if (activeTab !== value) {
    return null;
  }

  return (
    <TabPanelRoot className={clsx(classes.root, className)} role="tabpanel" {...other}>
      {children}
    </TabPanelRoot>
  );
}

export { TabPanel };
