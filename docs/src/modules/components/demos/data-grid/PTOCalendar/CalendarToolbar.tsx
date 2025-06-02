import Stack from '@mui/material/Stack';
import { FilterChips } from './FilterChips';
import { CalendarHeader } from './CalendarHeader';
import { useCalendarContext } from './CalendarContext';
import TextField from '@mui/material/TextField';
import Cancel from '@mui/icons-material/Cancel';
import Search from '@mui/icons-material/Search';
import { QuickFilter, QuickFilterClear, QuickFilterControl } from '@mui/x-data-grid-pro';
import InputAdornment from '@mui/material/InputAdornment';
import { styled } from '@mui/material/styles';

const StyledQuickFilter = styled(QuickFilter)({
  flex: 1,
  maxWidth: '260px',
});

function CalendarToolbar() {
  const { activeFilters, handleFilterRemove, handleFilterAdd } = useCalendarContext();
  return (
    <Stack gap={2} sx={{ pb: 3 }}>
      <CalendarHeader />
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={2}
      >
        <FilterChips
          activeFilters={activeFilters}
          onFilterRemove={handleFilterRemove}
          onFilterAdd={handleFilterAdd}
        />
        <StyledQuickFilter expanded>
          <QuickFilterControl
            render={({ ref, ...other }) => (
              <TextField
                {...other}
                sx={{
                  flex: 1,
                  width: '100%',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '20px',
                  },
                }}
                inputRef={ref}
                aria-label="Search"
                placeholder="Search employees"
                size="small"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                    endAdornment: other.value ? (
                      <InputAdornment position="end">
                        <QuickFilterClear
                          edge="end"
                          aria-label="Clear search"
                          material={{ sx: { marginRight: -0.75 } }}
                        >
                          <Cancel />
                        </QuickFilterClear>
                      </InputAdornment>
                    ) : null,
                    ...other.slotProps?.input,
                  },
                  ...other.slotProps,
                }}
              />
            )}
          />
        </StyledQuickFilter>
      </Stack>
    </Stack>
  );
}

export { CalendarToolbar };
