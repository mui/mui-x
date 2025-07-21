import * as React from 'react';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import {
  gridFilterModelSelector,
  useGridApiContext,
  useGridSelector,
  Toolbar,
  ToolbarButton,
  QuickFilter,
  QuickFilterControl,
  QuickFilterClear,
  QuickFilterTrigger,
} from '@mui/x-data-grid-premium';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import Tooltip from '@mui/material/Tooltip';

type OwnerState = {
  expanded: boolean;
};

const StyledQuickFilter = styled(QuickFilter)({
  display: 'grid',
  alignItems: 'center',
  marginLeft: 'auto',
});

const StyledToolbarButton = styled(ToolbarButton)<{ ownerState: OwnerState }>(
  ({ theme, ownerState }) => ({
    gridArea: '1 / 1',
    width: 'min-content',
    height: 'min-content',
    zIndex: 1,
    opacity: ownerState.expanded ? 0 : 1,
    pointerEvents: ownerState.expanded ? 'none' : 'auto',
    transition: theme.transitions.create(['opacity']),
  }),
);

const StyledTextField = styled(TextField)<{
  ownerState: OwnerState;
}>(({ theme, ownerState }) => ({
  gridArea: '1 / 1',
  overflowX: 'clip',
  width: ownerState.expanded ? 260 : 'var(--trigger-width)',
  opacity: ownerState.expanded ? 1 : 0,
  transition: theme.transitions.create(['width', 'opacity']),
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

export function InventoryToolbar() {
  const apiRef = useGridApiContext();

  const onStatusChange = React.useCallback(
    (status: 'all' | 'in_stock' | 'out_of_stock' | 'restocking') => {
      if (status === 'all') {
        apiRef.current!.upsertFilterItem({ field: 'status', operator: 'is', value: undefined });
      } else {
        apiRef.current!.upsertFilterItem({ field: 'status', operator: 'is', value: status });
      }
    },
    [apiRef],
  );

  const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
  const statusFilter = filterModel.items.find((item) => item.field === 'status')?.value || 'all';

  return (
    <Toolbar
      render={
        <Box
          sx={{
            mb: 2,
            display: 'flex',
            gap: 2,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        />
      }
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
      <StyledQuickFilter>
        <QuickFilterTrigger
          render={(triggerProps, state) => (
            <Tooltip title="Search" enterDelay={0}>
              <StyledToolbarButton
                {...triggerProps}
                ownerState={{ expanded: state.expanded }}
                color="default"
                aria-disabled={state.expanded}
              >
                <SearchIcon fontSize="small" />
              </StyledToolbarButton>
            </Tooltip>
          )}
        />
        <QuickFilterControl
          render={({ ref, ...controlProps }, state) => (
            <StyledTextField
              {...controlProps}
              ownerState={{ expanded: state.expanded }}
              inputRef={ref}
              aria-label="Search"
              placeholder="Search..."
              size="small"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: state.value ? (
                    <InputAdornment position="end">
                      <QuickFilterClear
                        edge="end"
                        size="small"
                        aria-label="Clear search"
                        material={{ sx: { marginRight: -0.75 } }}
                      >
                        <CancelIcon fontSize="small" />
                      </QuickFilterClear>
                    </InputAdornment>
                  ) : null,
                  ...controlProps.slotProps?.input,
                },
                ...controlProps.slotProps,
              }}
            />
          )}
        />
      </StyledQuickFilter>
    </Toolbar>
  );
}
