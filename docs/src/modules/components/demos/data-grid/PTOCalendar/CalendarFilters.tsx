import * as React from 'react';
import Stack from '@mui/material/Stack';
import { ToolbarButton } from '@mui/x-data-grid-premium';
import Chip from '@mui/material/Chip';
import Check from '@mui/icons-material/Check';
import { FilterType } from './types/pto';
import { FILTER_OPTIONS, FILTER_LABELS, FILTER_COLORS } from './constants';

interface CalendarFiltersProps {
  activeFilters: FilterType[];
  onFilterRemove: (filter: FilterType) => void;
  onFilterAdd: (filter: FilterType) => void;
}

export function CalendarFilters({
  activeFilters,
  onFilterRemove,
  onFilterAdd,
}: CalendarFiltersProps) {
  return (
    <Stack direction="row" alignItems="center" gap={1}>
      {FILTER_OPTIONS.map((filter) => {
        const isActive = activeFilters.includes(filter);
        return (
          <ToolbarButton
            key={filter}
            onClick={!isActive ? () => onFilterAdd(filter) : () => onFilterRemove(filter)}
            render={
              <Chip
                label={FILTER_LABELS[filter]}
                icon={isActive ? <Check fontSize="small" /> : undefined}
                color={isActive ? 'primary' : 'default'}
                variant={isActive ? 'filled' : 'outlined'}
                sx={(theme) => ({
                  '&.MuiChip-filled': {
                    ...FILTER_COLORS[filter].light,
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    '&:hover': {
                      backgroundColor: `color-mix(in srgb, ${FILTER_COLORS[filter].light.backgroundColor} 50%, #fff)`,
                    },
                    ...theme.applyStyles('dark', {
                      ...FILTER_COLORS[filter].dark,
                      '&:hover': {
                        backgroundColor: `color-mix(in srgb, ${FILTER_COLORS[filter].dark.backgroundColor} 90%, #fff)`,
                      },
                    }),
                  },
                  '&.MuiChip-outlined': {
                    borderColor: FILTER_COLORS[filter].light.borderColor,
                    color: FILTER_COLORS[filter].light.color,
                    '&:hover': {
                      backgroundColor: FILTER_COLORS[filter].light.backgroundColor,
                    },
                    ...theme.applyStyles('dark', {
                      color: FILTER_COLORS[filter].dark.color,
                      borderColor: FILTER_COLORS[filter].dark.borderColor,
                      '&:hover': {
                        backgroundColor: FILTER_COLORS[filter].dark.backgroundColor,
                      },
                    }),
                  },
                })}
              />
            }
          />
        );
      })}
    </Stack>
  );
}
