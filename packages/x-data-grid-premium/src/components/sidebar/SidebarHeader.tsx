import * as React from 'react';
import { styled } from '@mui/system';
import { getDataGridUtilityClass } from '@mui/x-data-grid-pro';
import { vars } from '@mui/x-data-grid-pro/internals';
import composeClasses from '@mui/utils/composeClasses';
import clsx from 'clsx';
import { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

export type SidebarHeaderProps = React.HTMLAttributes<HTMLDivElement>;

type OwnerState = Pick<DataGridPremiumProcessedProps, 'classes'>;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['sidebarHeader'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const SidebarHeaderRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'SidebarHeader',
})({
  position: 'sticky',
  top: 0,
  borderBottom: `1px solid ${vars.colors.border.base}`,
});

function SidebarHeader(props: SidebarHeaderProps) {
  const { className, children, ...other } = props;
  const { classes: classesRootProps } = useGridRootProps();
  const classes = useUtilityClasses({ classes: classesRootProps });

  return (
    <SidebarHeaderRoot className={clsx(className, classes.root)} {...other}>
      {children}
    </SidebarHeaderRoot>
  );
}

export { SidebarHeader };
