import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch, { switchClasses } from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import type { DataGridPremiumProcessedProps } from '../../../models/dataGridPremiumProps';
import { GridSidebarHeader } from '../GridSidebarHeader';
import { GridSidebarCloseButton } from '../GridSidebarCloseButton';
import { GridSidebarSearchButton } from '../GridSidebarSearchButton';

const HeaderRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1.25, 2),
  '& + &': {
    borderTop: `1px solid ${alpha(theme.palette.divider, 0.06)}`,
  },
}));

export function GridSidebarColumnPanelHeader(
  props: Pick<
    NonNullable<DataGridPremiumProcessedProps['pivotParams']>,
    'pivotMode' | 'onPivotModeChange'
  >,
) {
  const { pivotMode, onPivotModeChange } = props;

  return (
    <GridSidebarHeader>
      <HeaderRow>
        <Typography variant="body2" fontWeight="medium" sx={{ mr: 'auto' }}>
          Columns
        </Typography>
        <GridSidebarSearchButton />
        <GridSidebarCloseButton sx={{ mr: -1 }} />
      </HeaderRow>

      <HeaderRow>
        <FormControlLabel
          control={
            <Switch
              checked={pivotMode}
              onChange={(e) => onPivotModeChange(e.target.checked)}
              size="small"
            />
          }
          label="Pivot"
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
