import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import {
  gridFilterModelSelector,
  useGridApiContext,
  useGridSelector,
} from '@mui/x-data-grid-premium';

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

const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  // TODO: Maybe add a sliding animation across the toggles horizontally
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
      backgroundColor: theme.palette.action.selected,
    },
  },
}));

interface InventoryToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function InventoryToolbar({ searchQuery, onSearchChange }: InventoryToolbarProps) {
  const apiRef = useGridApiContext();

  const onStatusChange = React.useCallback(
    (status: 'all' | 'in_stock' | 'out_of_stock' | 'restocking') => {
      if (status === 'all') {
        apiRef.current!.setFilterModel({ items: [] });
      } else {
        apiRef.current!.setFilterModel({
          items: [{ field: 'status', operator: 'is', value: status }],
        });
      }
    },
    [apiRef],
  );

  const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
  const statusFilter = filterModel.items.find((item) => item.field === 'status')?.value || 'all';

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
        onChange={(event) => onSearchChange(event.target.value)}
        size="small"
      />
    </Box>
  );
}
