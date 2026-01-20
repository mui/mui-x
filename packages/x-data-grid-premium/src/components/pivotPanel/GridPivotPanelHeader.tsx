import * as React from 'react';
import { styled } from '@mui/system';
import {
  GridSlotProps,
  useGridSelector,
  getDataGridUtilityClass,
  gridRowCountSelector,
} from '@mui/x-data-grid-pro';
import { vars, NotRendered } from '@mui/x-data-grid-pro/internals';
import composeClasses from '@mui/utils/composeClasses';
import { SidebarHeader } from '../sidebar';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { gridPivotActiveSelector } from '../../hooks/features/pivoting/gridPivotingSelectors';
import { GridPivotPanelSearch } from './GridPivotPanelSearch';
import { DataGridPremiumProcessedProps } from '../../models/dataGridPremiumProps';

export interface GridPivotPanelHeaderProps {
  searchValue: string;
  onSearchValueChange: (value: string) => void;
}

type OwnerState = Omit<DataGridPremiumProcessedProps, 'rows'>;

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
  font: vars.typography.font.large,
  fontWeight: vars.typography.fontWeight.medium,
});

function GridPivotPanelHeader(props: GridPivotPanelHeaderProps) {
  const { searchValue, onSearchValueChange } = props;
  const apiRef = useGridApiContext();
  const { rows, ...rootProps } = useGridRootProps();
  const { slots, slotProps } = rootProps;
  const pivotActive = useGridSelector(apiRef, gridPivotActiveSelector);
  const classes = useUtilityClasses(rootProps);
  const rowCount = useGridSelector(apiRef, gridRowCountSelector);
  const isEmptyPivot = pivotActive && rowCount === 0;

  return (
    <SidebarHeader>
      <GridPivotPanelHeaderRoot className={classes.root} ownerState={rootProps}>
        <GridPivotPanelSwitch
          ownerState={rootProps}
          as={slots.baseSwitch}
          className={classes.switch}
          checked={pivotActive}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            apiRef.current.setPivotActive(event.target.checked)
          }
          size="small"
          label={
            <GridPivotPanelSwitchLabel className={classes.label} ownerState={rootProps}>
              {apiRef.current.getLocaleText('pivotToggleLabel')}
            </GridPivotPanelSwitchLabel>
          }
          {...slotProps?.baseSwitch}
        />
        <slots.baseIconButton
          onClick={() => {
            apiRef.current.hideSidebar();
            if (isEmptyPivot) {
              apiRef.current.setPivotActive(false);
            }
          }}
          aria-label={apiRef.current.getLocaleText('pivotCloseButton')}
          {...slotProps?.baseIconButton}
        >
          <slots.sidebarCloseIcon fontSize="small" />
        </slots.baseIconButton>
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
