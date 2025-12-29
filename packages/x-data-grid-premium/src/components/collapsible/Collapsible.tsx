'use client';
import * as React from 'react';
import { styled } from '@mui/system';
import { vars } from '@mui/x-data-grid-pro/internals';
import useId from '@mui/utils/useId';
import { getDataGridUtilityClass } from '@mui/x-data-grid-pro';
import composeClasses from '@mui/utils/composeClasses';
import clsx from 'clsx';
import { CollapsibleContext } from './CollapsibleContext';
import { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';

type CollapsibleProps = React.HTMLAttributes<HTMLDivElement> & {
  initiallyOpen?: boolean;
};

type OwnerState = Pick<DataGridPremiumProcessedProps, 'classes'> & { open: boolean };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['collapsible'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const CollapsibleRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'Collapsible',
})<{ ownerState: OwnerState }>(({ ownerState }) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: ownerState.open ? '1 0 auto' : '0 0 auto',
  borderRadius: vars.radius.base,
}));

function Collapsible(props: CollapsibleProps) {
  const { className, children, initiallyOpen = true, ...other } = props;
  const [open, setOpen] = React.useState(initiallyOpen);
  const panelId = useId();
  const { classes: rootPropsClasses } = useGridRootProps();
  const ownerState = { classes: rootPropsClasses, open };
  const classes = useUtilityClasses(ownerState);

  const contextValue = React.useMemo(
    () => ({ open, onOpenChange: setOpen, panelId }),
    [open, setOpen, panelId],
  );

  return (
    <CollapsibleContext.Provider value={contextValue}>
      <CollapsibleRoot ownerState={ownerState} className={clsx(classes.root, className)} {...other}>
        {children}
      </CollapsibleRoot>
    </CollapsibleContext.Provider>
  );
}

export { Collapsible };
