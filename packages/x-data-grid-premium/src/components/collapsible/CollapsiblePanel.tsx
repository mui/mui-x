import * as React from 'react';
import { styled } from '@mui/system';
import { vars } from '@mui/x-data-grid/internals';
import useId from '@mui/utils/useId';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { getDataGridUtilityClass } from '@mui/x-data-grid-pro';
import clsx from 'clsx';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';
import { useCollapsibleContext } from './CollapsibleContext';

export type CollapsiblePanelProps = React.HTMLAttributes<HTMLDivElement>;

type OwnerState = DataGridPremiumProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['collapsiblePanel'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const CollapsiblePanelRoot = styled('div', {
  name: 'DataGrid',
  slot: 'CollapsiblePanel',
})<{ ownerState: OwnerState }>({
  borderTop: `1px solid ${vars.colors.border.base}`,
  flex: 1,
  overflow: 'hidden',
});

function CollapsiblePanel(props: CollapsiblePanelProps) {
  const { 'aria-label': ariaLabel, children, className, ...other } = props;
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);
  const id = useId();
  const { open } = useCollapsibleContext();

  if (!open) {
    return null;
  }

  return (
    <CollapsiblePanelRoot
      ownerState={rootProps}
      className={clsx(classes.root, className)}
      id={id}
      {...other}
    >
      {children}
    </CollapsiblePanelRoot>
  );
}

export { CollapsiblePanel };
