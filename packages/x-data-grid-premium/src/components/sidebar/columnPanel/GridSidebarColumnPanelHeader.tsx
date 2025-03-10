import * as React from 'react';
import { styled } from '@mui/system';
import { vars } from '@mui/x-data-grid/internals';
import { useGridSelector } from '@mui/x-data-grid-pro';
import { GridSidebarHeader } from '../GridSidebarHeader';
import { GridSidebarCloseButton } from '../GridSidebarCloseButton';
import { GridSidebarSearchButton } from '../GridSidebarSearchButton';
import { GridSidebarSearchField } from '../GridSidebarSearchField';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';
import { useGridRootProps } from '../../../hooks/utils/useGridRootProps';
import { gridPivotEnabledSelector } from '../../../hooks/features/pivoting/gridPivotingSelectors';

export interface GridSidebarColumnPanelHeaderProps {
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
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  padding: vars.spacing(0, 2),
  boxSizing: 'border-box',
  height: 52,
});

const Subheader = styled('div')({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  padding: vars.spacing(1.25, 2),
  borderTop: `1px solid ${vars.colors.border.muted}`,
});

const Title = styled('span')({
  ...vars.typography.large,
  fontWeight: vars.typography.fontWeight.medium,
  marginRight: 'auto',
});

export function GridSidebarColumnPanelHeader(props: GridSidebarColumnPanelHeaderProps) {
  const { searchState, onSearchStateChange } = props;
  const apiRef = useGridApiContext();
  const rootProps = useGridRootProps();

  const enableSearch = () => {
    onSearchStateChange((state) => ({ ...state, enabled: true }));
  };

  const pivotEnabled = useGridSelector(apiRef, gridPivotEnabledSelector);

  return (
    <GridSidebarHeader>
      <Header>
        {searchState.enabled ? (
          <GridSidebarSearchField
            value={searchState.value}
            onClear={() => onSearchStateChange({ value: '', enabled: false })}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              onSearchStateChange({ value: event.target.value, enabled: true })
            }
            autoFocus
          />
        ) : (
          <React.Fragment>
            <Title>{apiRef.current.getLocaleText('pivotSettings')}</Title>
            <GridSidebarSearchButton onClick={enableSearch} />
            <GridSidebarCloseButton sx={{ mr: -1 }} />
          </React.Fragment>
        )}
      </Header>

      <Subheader>
        <rootProps.slots.baseSwitch
          checked={pivotEnabled}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            apiRef.current.setPivotEnabled(event.target.checked)
          }
          size="small"
          label={apiRef.current.getLocaleText('pivotToggleLabel')}
          labelPlacement="start"
          fullWidth
        />
      </Subheader>
    </GridSidebarHeader>
  );
}
