import * as React from 'react';
import { styled } from '@mui/system';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch, { switchClasses } from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { vars } from '@mui/x-data-grid/internals';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { GridSidebarHeader } from '../GridSidebarHeader';
import { GridSidebarCloseButton } from '../GridSidebarCloseButton';
import { GridSidebarSearchButton } from '../GridSidebarSearchButton';
import { GridSidebarSearchField } from '../GridSidebarSearchField';
import { useGridApiContext } from '../../../hooks/utils/useGridApiContext';

export interface GridSidebarColumnPanelHeaderProps
  extends Pick<
    NonNullable<DataGridPremiumProcessedProps['pivotParams']>,
    'pivotMode' | 'onPivotModeChange'
  > {
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

const HeaderRow = styled('div')({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  padding: vars.spacing(1.25, 2),
  '& + &': {
    borderTop: `1px solid ${vars.colors.border.muted}`,
  },
});

const SearchField = styled(GridSidebarSearchField)({
  width: '100%',
  borderBottom: `1px solid ${vars.colors.border.muted}`,
  // TODO: Remove material imports
  [`& .${outlinedInputClasses.root}`]: {
    height: 50,
  },
  [`& .${outlinedInputClasses.notchedOutline}`]: {
    display: 'none',
  },
});

export function GridSidebarColumnPanelHeader(props: GridSidebarColumnPanelHeaderProps) {
  const { pivotMode, searchState, onPivotModeChange, onSearchStateChange } = props;
  const apiRef = useGridApiContext();

  const enableSearch = () => {
    onSearchStateChange((state) => ({ ...state, enabled: true }));
  };

  return (
    <GridSidebarHeader>
      {searchState.enabled ? (
        <SearchField
          value={searchState.value}
          onClear={() => onSearchStateChange({ value: '', enabled: false })}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            onSearchStateChange({ value: event.target.value, enabled: true })
          }
          autoFocus
        />
      ) : (
        <HeaderRow>
          <Typography variant="subtitle1" fontWeight="medium" sx={{ mr: 'auto' }}>
            {apiRef.current.getLocaleText('pivotSettings')}
          </Typography>
          <GridSidebarSearchButton onClick={enableSearch} />
          <GridSidebarCloseButton sx={{ mr: -1 }} />
        </HeaderRow>
      )}

      <HeaderRow>
        <FormControlLabel
          control={
            <Switch
              checked={pivotMode}
              onChange={(event) => onPivotModeChange(event.target.checked)}
              size="small"
            />
          }
          label={apiRef.current.getLocaleText('pivotToggleLabel')}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            marginLeft: 0,
            marginRight: 0,
            [`& .${switchClasses.root}`]: {
              marginRight: -1,
            },
          }}
          slotProps={{
            typography: {
              variant: 'body2',
            },
          }}
          labelPlacement="start"
        />
      </HeaderRow>
    </GridSidebarHeader>
  );
}
