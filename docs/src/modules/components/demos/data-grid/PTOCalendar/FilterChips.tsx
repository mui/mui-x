import React from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { FilterType } from './types/pto';
import { FILTER_OPTIONS, FILTER_LABELS, FILTER_COLORS } from './constants';
import Check from '@mui/icons-material/Check';

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
  return (
    <Stack direction="row" alignItems="center" gap={2} sx={{ overflow: 'auto', py: 1 }}>
      <Typography variant="h6" sx={{ color: '#09090b', fontWeight: 'bold' }}>
        Filter
      </Typography>
      {FILTER_OPTIONS.map((filter) => {
        const isActive = activeFilters.includes(filter);
        return (
          <Chip
            key={filter}
            label={FILTER_LABELS[filter]}
            onClick={!isActive ? () => onFilterAdd(filter) : () => onFilterRemove(filter)}
            icon={isActive ? <Check fontSize="small" /> : undefined}
            color={isActive ? 'primary' : 'default'}
            variant={isActive ? 'filled' : 'outlined'}
            sx={{
              px: 0.5,
              '&.MuiChip-filled': {
                backgroundColor: FILTER_COLORS[filter].background,
                color: FILTER_COLORS[filter].text,
                '& .MuiChip-deleteIcon': {
                  color: FILTER_COLORS[filter].text,
                },
              },
              '&.MuiChip-outlined': {
                borderColor: FILTER_COLORS[filter].border,
                color: FILTER_COLORS[filter].text,
              },
            }}
          />
        );
      })}
    </Stack>
  );
};
