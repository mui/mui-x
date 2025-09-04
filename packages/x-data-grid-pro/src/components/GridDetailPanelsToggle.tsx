import * as React from 'react';
import { getDataGridUtilityClass } from '@mui/x-data-grid';
import { useGridApiContext, useGridRootProps } from '@mui/x-data-grid-pro';
import composeClasses from '@mui/utils/composeClasses';
import { DataGridProProcessedProps } from '../models/dataGridProProps';

export interface GridDetailPanelsToggleProps {
  hasContent: boolean;
  isExpanded: boolean;
}

type OwnerState = { classes: DataGridProProcessedProps['classes']; isExpanded: boolean };

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes, isExpanded } = ownerState;

  const slots = {
    root: ['detailPanelToggleCell', isExpanded && 'detailPanelToggleCell--expanded'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

export function GridDetailPanelsToggle(props: GridDetailPanelsToggleProps) {
  const { hasContent, isExpanded } = props;

  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();
  const ownerState: OwnerState = { classes: rootProps.classes, isExpanded };
  const classes = useUtilityClasses(ownerState);

  const Icon = isExpanded
    ? rootProps.slots.detailPanelCollapseIcon
    : rootProps.slots.detailPanelExpandIcon;

  return (
    <rootProps.slots.baseIconButton
      size="small"
      tabIndex={-1}
      disabled={!hasContent}
      className={classes.root}
      aria-expanded={isExpanded}
      aria-label={
        isExpanded
          ? apiRef.current.getLocaleText('collapseDetailPanel')
          : apiRef.current.getLocaleText('expandDetailPanel')
      }
      {...rootProps.slotProps?.baseIconButton}
    >
      <Icon fontSize="inherit" />
    </rootProps.slots.baseIconButton>
  );
}
