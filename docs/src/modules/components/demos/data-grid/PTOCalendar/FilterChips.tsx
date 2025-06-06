import React from 'react';
import Stack from '@mui/material/Stack';
import { ToolbarButton } from '@mui/x-data-grid-premium';
import Chip from '@mui/material/Chip';
import { FilterType } from './types/pto';
import { FILTER_OPTIONS, FILTER_LABELS, FILTER_COLORS } from './constants';
import Check from '@mui/icons-material/Check';
import { useTheme } from '@mui/material/styles';

interface FilterChipsProps {
  activeFilters: FilterType[];
  onFilterRemove: (filter: FilterType) => void;
  onFilterAdd: (filter: FilterType) => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  activeFilters,
  onFilterRemove,
  onFilterAdd,
}) => {
  const theme = useTheme();
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
                sx={{
                  '&.MuiChip-filled': {
                    backgroundColor: FILTER_COLORS[filter].background,
                    color: FILTER_COLORS[filter].text,
                    border: `1px solid ${FILTER_COLORS[filter].border}`,
                    '&:hover': {
                      backgroundColor: `color-mix(in srgb, ${FILTER_COLORS[filter].background} 50%, #fff)`,
                    },
                    ...theme.applyStyles('dark', {
                      backgroundColor: FILTER_COLORS[filter].dark.background,
                      color: FILTER_COLORS[filter].dark.text,
                      borderColor: FILTER_COLORS[filter].dark.border,
                      '&:hover': {
                        backgroundColor: `color-mix(in srgb, ${FILTER_COLORS[filter].dark.background} 90%, #fff)`,
                      },
                    }),
                  },
                  '&.MuiChip-outlined': {
                    borderColor: FILTER_COLORS[filter].border,
                    color: FILTER_COLORS[filter].text,
                    '&:hover': {
                      backgroundColor: FILTER_COLORS[filter].background,
                    },
                    ...theme.applyStyles('dark', {
                      color: FILTER_COLORS[filter].dark.text,
                      borderColor: FILTER_COLORS[filter].dark.border,
                      '&:hover': {
                        backgroundColor: FILTER_COLORS[filter].dark.background,
                      },
                    }),
                  },
                }}
              />
            }
          />
        );
      })}
    </Stack>
  );
};
