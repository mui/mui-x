import * as React from 'react';
import { styled } from '@mui/system';
import {
  GridSlotProps,
  NotRendered,
  useGridSelector,
  getDataGridUtilityClass,
} from '@mui/x-data-grid-pro';
import { vars } from '@mui/x-data-grid-pro/internals';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { SidebarHeader } from '../sidebar';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { gridPivotEnabledSelector } from '../../hooks/features/pivoting/gridPivotingSelectors';
import { GridPivotPanelSearch } from './GridPivotPanelSearch';
import { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';

export interface GridPivotPanelHeaderProps {
  searchValue: string;
  onSearchValueChange: (value: string) => void;
}

type OwnerState = DataGridPremiumProcessedProps;

const useUtilityClasses = (ownerState: OwnerState) => {
  const { classes } = ownerState;

  const slots = {
    root: ['pivotPanelHeader'],
    switch: ['pivotPanelSwitch'],
    label: ['pivotPanelSwitchLabel'],
  };

  return composeClasses(slots, getDataGridUtilityClass, classes);
};

const GridPivotPanelHeaderRoot = styled('div', {
  name: 'MuiDataGrid',
  slot: 'PivotPanelHeader',
})<{ ownerState: OwnerState }>({
  display: 'flex',
  alignItems: 'center',
  gap: vars.spacing(1),
  padding: vars.spacing(0, 0.75, 0, 1),
  boxSizing: 'border-box',
  height: 52,
});

const GridPivotPanelSwitch = styled(NotRendered<GridSlotProps['baseSwitch']>, {
  name: 'MuiDataGrid',
  slot: 'PivotPanelSwitch',
})<{ ownerState: OwnerState }>({
  marginRight: 'auto',
});

const GridPivotPanelSwitchLabel = styled('span', {
  name: 'MuiDataGrid',
  slot: 'PivotPanelSwitchLabel',
})<{ ownerState: OwnerState }>({
  ...vars.typography.large,
  fontWeight: vars.typography.fontWeight.medium,
});

function GridPivotPanelHeader(props: GridPivotPanelHeaderProps) {
  const { searchValue, onSearchValueChange } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();
  const pivotEnabled = useGridSelector(apiRef, gridPivotEnabledSelector);
  const classes = useUtilityClasses(rootProps);

  return (
    <SidebarHeader>
      <GridPivotPanelHeaderRoot ownerState={rootProps} className={classes.root}>
        <GridPivotPanelSwitch
          as={rootProps.slots.baseSwitch}
          ownerState={rootProps}
          className={classes.switch}
          checked={pivotEnabled}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            apiRef.current.setPivotEnabled(event.target.checked)
          }
          size="small"
          label={
            <GridPivotPanelSwitchLabel ownerState={rootProps} className={classes.label}>
              {apiRef.current.getLocaleText('pivotToggleLabel')}
            </GridPivotPanelSwitchLabel>
          }
          {...rootProps.slotProps?.baseSwitch}
        />
        <rootProps.slots.baseIconButton
          onClick={() => apiRef.current.setPivotPanelOpen(false)}
          aria-label={apiRef.current.getLocaleText('pivotCloseButton')}
          {...rootProps.slotProps?.baseIconButton}
        >
          <rootProps.slots.sidebarCloseIcon fontSize="small" />
        </rootProps.slots.baseIconButton>
      </GridPivotPanelHeaderRoot>
      <GridPivotPanelSearch
        value={searchValue}
        onClear={() => onSearchValueChange('')}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          onSearchValueChange(event.target.value)
        }
      />
    </SidebarHeader>
  );
}

export { GridPivotPanelHeader };
