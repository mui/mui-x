import React from 'react';
import { Box, TextField, ButtonGroup, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const SearchTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: theme.palette.background.paper,
    '& fieldset': {
      borderColor: theme.palette.divider,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({ // TODO: Maybe add a sliding animation across the toggles horizontally
  backgroundColor: theme.palette.background.paper,
  borderRadius: '8px',
  border: `1px solid ${theme.palette.divider}`,
  padding: '4px',
  gap: '4px',
  '& .MuiButton-root': {
    border: 'none',
    borderRadius: '6px',
    padding: '6px 12px',
    textTransform: 'none',
    color: theme.palette.text.secondary,
    '&.MuiButton-contained': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

interface InventoryToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
}

export function InventoryToolbar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: InventoryToolbarProps) {
  return (
    <Box
      sx={{
        mb: 2,
        display: 'flex',
        gap: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <StyledButtonGroup>
        <Button
          onClick={() => onStatusChange('all')}
          variant={statusFilter === 'all' ? 'contained' : 'text'}
          disableRipple
        >
          All
        </Button>
        <Button
          onClick={() => onStatusChange('in_stock')}
          variant={statusFilter === 'in_stock' ? 'contained' : 'text'}
          disableRipple
        >
          In Stock
        </Button>
        <Button
          onClick={() => onStatusChange('out_of_stock')}
          variant={statusFilter === 'out_of_stock' ? 'contained' : 'text'}
          disableRipple
        >
          Out of Stock
        </Button>
        <Button
          onClick={() => onStatusChange('restocking')}
          variant={statusFilter === 'restocking' ? 'contained' : 'text'}
          disableRipple
        >
          Restocking
        </Button>
      </StyledButtonGroup>
      <SearchTextField
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        size="small"
      />
    </Box>
  );
}
