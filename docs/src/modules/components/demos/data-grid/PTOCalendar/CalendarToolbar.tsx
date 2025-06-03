import Stack from '@mui/material/Stack';
import { FilterChips } from './FilterChips';
import { useCalendarContext } from './CalendarContext';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { CalendarNavigation } from './CalendarNavigation';
import { CalendarSearch } from './CalendarSearch';

function CalendarToolbar() {
  const { activeFilters, handleFilterRemove, handleFilterAdd } = useCalendarContext();
  const theme = useTheme();

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
          borderBottomColor: '#f2eff3',
          px: 2,
          py: 1.75,
          ...theme.applyStyles('dark', {
            borderBottomColor: '#38363E',
          }),
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
