import * as React from 'react';
import { styled } from '@mui/system';
import { vars } from '@mui/x-data-grid-pro/internals';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { getDataGridUtilityClass } from '@mui/x-data-grid-pro';
import clsx from 'clsx';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';
import { useCollapsibleContext } from './CollapsibleContext';

export type CollapsibleTriggerProps = React.HTMLAttributes<HTMLDivElement>;

type OwnerState = Pick<DataGridPremiumProcessedProps, 'classes'> & { open: boolean };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['collapsibleTrigger'],
    icon: ['collapsibleIcon'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const CollapsibleTriggerRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CollapsibleTrigger',
})<{ ownerState: OwnerState }>({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 40,
  padding: vars.spacing(0, 1.5),
  '&:hover': {
    backgroundColor: vars.colors.interactive.hover,
    cursor: 'pointer',
  },
});

const CollapsibleIcon = styled('div', {
  name: 'MuiDataGrid',
  slot: 'CollapsibleIcon',
})<{ ownerState: OwnerState }>(({ ownerState }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: vars.colors.foreground.muted,
  transform: ownerState.open ? 'none' : 'rotate(180deg)',
  transition: vars.transition(['transform'], {
    duration: vars.transitions.duration.short,
    easing: vars.transitions.easing.easeInOut,
  }),
}));

function CollapsibleTrigger(props: CollapsibleTriggerProps) {
  const { children, className, ...other } = props;
  const rootProps = useGridRootProps();
  const { open, onOpenChange, panelId } = useCollapsibleContext();
  const ownerState = { classes: rootProps.classes, open };
  const classes = useUtilityClasses(ownerState);

  return (
    <CollapsibleTriggerRoot
      ownerState={ownerState}
      className={clsx(classes.root, className)}
      role="button"
      tabIndex={0}
      aria-controls={open ? panelId : undefined}
      aria-expanded={!open}
      onClick={() => onOpenChange(!open)}
      {...other}
    >
      {children}
      <CollapsibleIcon ownerState={ownerState} className={classes.icon}>
        <rootProps.slots.collapsibleIcon />
      </CollapsibleIcon>
    </CollapsibleTriggerRoot>
  );
}

export { CollapsibleTrigger };
