import React from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { FilterType } from './types/pto';
import { FILTER_OPTIONS, FILTER_LABELS, FILTER_COLORS } from './constants';

interface FilterChipsProps {
  activeFilters: FilterType[];
  onFilterRemove: (filter: FilterType) => void;
  onFilterAdd: (filter: FilterType) => void;
  employeeCount: number;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  activeFilters,
  onFilterRemove,
  onFilterAdd,
  employeeCount,
}) => {
  return (
    <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, width: '100%' }}>
      <Typography
        variant="h6"
        sx={{
          color: '#09090b',
          fontWeight: 'bold',
          flexShrink: 0,
          mr: 1,
        }}
      >
        Employees ({employeeCount})
      </Typography>
      {FILTER_OPTIONS.map((filter) => (
        <Chip
          key={filter}
          label={FILTER_LABELS[filter]}
          onDelete={activeFilters.includes(filter) ? () => onFilterRemove(filter) : undefined}
          onClick={!activeFilters.includes(filter) ? () => onFilterAdd(filter) : undefined}
          color={activeFilters.includes(filter) ? 'primary' : 'default'}
          variant={activeFilters.includes(filter) ? 'filled' : 'outlined'}
          sx={{
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
      ))}
    </Stack>
  );
};
