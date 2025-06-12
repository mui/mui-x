import * as React from 'react';
import { styled } from '@mui/system';
import { vars } from '@mui/x-data-grid-pro/internals';
import composeClasses from '@mui/utils/composeClasses';
import { getDataGridUtilityClass } from '@mui/x-data-grid-pro';
import clsx from 'clsx';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';
import { useTabsContext } from './TabsContext';

export type TabProps = React.HTMLAttributes<HTMLButtonElement> & {
  value: string;
};

type OwnerState = Pick<DataGridPremiumProcessedProps, 'classes'> & { active: boolean };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['tab'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const TabRoot = styled('button', {
  name: 'MuiDataGrid',
  slot: 'Tab',
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active?: boolean }>(({ active }) => ({
  flex: 1,
  padding: vars.spacing(1, 2),
  background: active ? vars.colors.background.base : 'transparent',
  color: active ? vars.colors.interactive.selected : vars.colors.foreground.base,
  border: 'none',
  borderBottom: active ? `2px solid ${vars.colors.interactive.selected}` : '2px solid transparent',
  font: vars.typography.font.body,
  fontWeight: active ? vars.typography.fontWeight.medium : vars.typography.fontWeight.regular,
  cursor: 'pointer',
  transition: 'color 0.2s, border-bottom 0.2s',
  '&:hover': {
    background: vars.colors.interactive.hover,
    color: vars.colors.interactive.selected,
  },
}));

function Tab(props: TabProps) {
  const { value, children, className, ...other } = props;
  const rootProps = useGridRootProps();
  const { activeTab, setActiveTab } = useTabsContext();
  const ownerState = { classes: rootProps.classes, active: activeTab === value };
  const classes = useUtilityClasses(ownerState);

  return (
    <TabRoot
      className={clsx(classes.root, className)}
      type="button"
      role="tab"
      aria-selected={activeTab === value}
      active={activeTab === value}
      onClick={() => setActiveTab(value)}
      {...other}
    >
      {children}
    </TabRoot>
  );
}

export { Tab };
