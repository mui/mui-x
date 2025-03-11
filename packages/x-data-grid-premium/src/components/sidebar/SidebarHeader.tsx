import * as React from 'react';
import { styled } from '@mui/system';
import { DataGridProcessedProps, vars } from '@mui/x-data-grid/internals';
import { getDataGridUtilityClass, useGridRootProps } from '@mui/x-data-grid-pro';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import clsx from 'clsx';

export type SidebarHeaderProps = React.HTMLAttributes<HTMLDivElement>;

type OwnerState = DataGridProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['sidebarHeader'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const SidebarHeaderRoot = styled('div', {
  name: 'DataGrid',
  slot: 'SidebarHeader',
})<{ ownerState: OwnerState }>({
  position: 'sticky',
  top: 0,
  borderBottom: `1px solid ${vars.colors.border.base}`,
});

function SidebarHeader(props: SidebarHeaderProps) {
  const { className, children, ...other } = props;
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);

  return (
    <SidebarHeaderRoot className={clsx(className, classes.root)} ownerState={rootProps} {...other}>
      {children}
    </SidebarHeaderRoot>
  );
}

export { SidebarHeader };
