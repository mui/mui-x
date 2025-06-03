import Stack from '@mui/material/Stack';
import { FilterChips } from './FilterChips';
import { useCalendarContext } from './CalendarContext';
import Typography from '@mui/material/Typography';
import { CalendarNavigation } from './CalendarNavigation';
import { CalendarSearch } from './CalendarSearch';

function CalendarToolbar() {
  const { activeFilters, handleFilterRemove, handleFilterAdd } = useCalendarContext();

  return (
    <Stack>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={2}
        sx={{
          borderBottom: '1px solid',
          borderBottomColor: 'divider',
          px: 2,
          py: 1.75,
        }}
      >
        <Typography fontSize="1.25rem" fontWeight="bold">
          Time Off Calendar
        </Typography>
        <CalendarNavigation />
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={2}
        sx={{ px: 2, py: 1.75 }}
      >
        <FilterChips
          activeFilters={activeFilters}
          onFilterRemove={handleFilterRemove}
          onFilterAdd={handleFilterAdd}
        />
        <CalendarSearch />
      </Stack>
    </Stack>
  );
}

export { CalendarToolbar };
