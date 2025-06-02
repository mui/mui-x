import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { FilterChips } from './FilterChips';
import { CalendarHeader } from './CalendarHeader';
import { useCalendarContext } from './CalendarContext';
import { gridRowCountSelector, useGridApiContext, useGridSelector } from '@mui/x-data-grid-pro';

function CalendarToolbar() {
  const apiRef = useGridApiContext();
  const rowCount = useGridSelector(apiRef, gridRowCountSelector);
  const { activeFilters, handleFilterRemove, handleFilterAdd } = useCalendarContext();

  return (
    <Stack gap={2} sx={{ borderBottom: '1px solid', borderBottomColor: 'divider', mb: 3, pb: 3 }}>
      <Typography variant="h4" fontWeight="bold">
        Time Off Calendar
      </Typography>
      <CalendarHeader />
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 2,
          flexWrap: 'wrap',
          '& .MuiStack-root': {
            flex: 1,
            minWidth: { xs: '100%', sm: 'auto' },
          },
        }}
      >
        <FilterChips
          activeFilters={activeFilters}
          onFilterRemove={handleFilterRemove}
          onFilterAdd={handleFilterAdd}
          employeeCount={rowCount}
        />
      </Box>
    </Stack>
  );
}

export { CalendarToolbar };
