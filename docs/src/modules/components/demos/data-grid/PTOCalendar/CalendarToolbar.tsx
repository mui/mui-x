import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Toolbar } from '@mui/x-data-grid-premium';
import { styled } from '@mui/material/styles';
import { CalendarFilters } from './CalendarFilters';
import { useCalendarContext } from './CalendarContext';
import { CalendarNavigation } from './CalendarNavigation';
import { CalendarDensity } from './CalendarDensity';

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  padding: 0,
  width: '100%',
  minHeight: 'auto',
});

function CalendarToolbar() {
  const {
    activeFilters,
    showPresentToday,
    handleFilterRemove,
    handleFilterAdd,
    handleTogglePresentToday,
  } = useCalendarContext();

  return (
    <StyledToolbar>
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
          py: 1.5,
        }}
      >
        <Typography fontSize="1.2rem" fontWeight="bold">
          Time Off Calendar
        </Typography>
        <CalendarDensity />
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={1}
        sx={{
          borderBottom: '1px solid',
          borderBottomColor: 'divider',
          px: 2,
          py: 1.5,
        }}
      >
        <CalendarFilters
          activeFilters={activeFilters}
          showPresentToday={showPresentToday}
          onFilterRemove={handleFilterRemove}
          onFilterAdd={handleFilterAdd}
          onTogglePresentToday={handleTogglePresentToday}
        />
        <CalendarNavigation />
      </Stack>
    </StyledToolbar>
  );
}

export { CalendarToolbar };
