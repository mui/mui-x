import * as React from 'react';
import { styled } from '@mui/material/styles';
import { getDataGridUtilityClass } from '@mui/x-data-grid-pro';
import { vars } from '@mui/x-data-grid-pro/internals';
import composeClasses from '@mui/utils/composeClasses';
import { SidebarHeader } from '../sidebar';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import type { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';

export interface GridComputedColumnsPanelHeaderProps {
  title: string;
  /**
   * The id of the title element, for the panel's `aria-labelledby`.
   */
  titleId?: string;
  onClose: () => void;
}

type OwnerState = DataGridPremiumProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['computedColumnsPanelHeader'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridComputedColumnsPanelHeaderRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'ComputedColumnsPanelHeader',
})<{ ownerState: OwnerState }>({
  display: 'flex',
  alignItems: 'center',
  gap: vars.spacing(1),
  padding: vars.spacing(0, 0.75, 0, 1.5),
  boxSizing: 'border-box',
  height: 52,
});

const GridComputedColumnsPanelTitle = styled('span', {
  name: 'MuiDataGrid',
  slot: 'ComputedColumnsPanelTitle',
})<{ ownerState: OwnerState }>({
  flex: 1,
  minWidth: 0,
  font: vars.typography.font.large,
  fontWeight: vars.typography.fontWeight.medium,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

function GridComputedColumnsPanelHeader(props: GridComputedColumnsPanelHeaderProps) {
  const { title, titleId, onClose } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const classes = useUtilityClasses(rootProps);

  return (
    <SidebarHeader>
      <GridComputedColumnsPanelHeaderRoot ownerState={rootProps} className={classes.root}>
        <GridComputedColumnsPanelTitle ownerState={rootProps} id={titleId}>
          {title}
        </GridComputedColumnsPanelTitle>
        <rootProps.slots.baseIconButton
          onClick={onClose}
          aria-label={apiRef.current.getLocaleText('computedColumnsPanelCloseButton')}
          {...rootProps.slotProps?.baseIconButton}
        >
          <rootProps.slots.sidebarCloseIcon fontSize="small" />
        </rootProps.slots.baseIconButton>
      </GridComputedColumnsPanelHeaderRoot>
    </SidebarHeader>
  );
}

export { GridComputedColumnsPanelHeader };
