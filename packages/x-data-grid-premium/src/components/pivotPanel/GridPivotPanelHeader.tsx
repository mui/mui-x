import * as React from 'react';
import { styled } from '@mui/system';
import { vars } from '@mui/x-data-grid/internals';
import { GridSlotProps, NotRendered, useGridSelector } from '@mui/x-data-grid-pro';
import { SidebarHeader } from '../sidebar';
import { useGridApiContext } from '../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../hooks/utils/useGridRootProps';
import { gridPivotEnabledSelector } from '../../hooks/features/pivoting/gridPivotingSelectors';
import { GridPivotPanelSearch } from './GridPivotPanelSearch';

export interface GridPivotPanelHeaderProps {
  searchState: {
    value: string;
    enabled: boolean;
  };
  onSearchStateChange: React.Dispatch<
    React.SetStateAction<{
      value: string;
      enabled: boolean;
    }>
  >;
}

const Header = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: vars.spacing(1),
  padding: vars.spacing(0, 0.75, 0, 1),
  boxSizing: 'border-box',
  height: 52,
});

const SearchFieldContainer = styled('div')({
  padding: vars.spacing(0, 1, 1),
});

const Switch = styled(NotRendered<GridSlotProps['baseSwitch']>)({
  marginRight: 'auto',
});

const Title = styled('span')({
  ...vars.typography.large,
  fontWeight: vars.typography.fontWeight.medium,
});

function GridPivotPanelHeader(props: GridPivotPanelHeaderProps) {
  const { searchState, onSearchStateChange } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

  const pivotEnabled = useGridSelector(apiRef, gridPivotEnabledSelector);

  return (
    <SidebarHeader>
      <Header>
        <Switch
          as={rootProps.slots.baseSwitch}
          checked={pivotEnabled}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            apiRef.current.setPivotEnabled(event.target.checked)
          }
          size="small"
          label={<Title>{apiRef.current.getLocaleText('pivot')}</Title>}
        />
        <rootProps.slots.baseIconButton
          {...props}
          onClick={() => apiRef.current.setPivotPanelOpen(false)}
        >
          <rootProps.slots.sidebarCloseIcon fontSize="small" />
        </rootProps.slots.baseIconButton>
      </Header>
      <SearchFieldContainer>
        <GridPivotPanelSearch
          value={searchState.value}
          onClear={() => onSearchStateChange({ value: '', enabled: false })}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            onSearchStateChange({ value: event.target.value, enabled: true })
          }
        />
      </SearchFieldContainer>
    </SidebarHeader>
  );
}

export { GridPivotPanelHeader };
