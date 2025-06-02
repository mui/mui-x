import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Cancel from '@mui/icons-material/Cancel';
import Search from '@mui/icons-material/Search';
import { QuickFilter, QuickFilterClear, QuickFilterControl } from '@mui/x-data-grid-pro';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useCalendarContext } from './CalendarContext';
import InputAdornment from '@mui/material/InputAdornment';
import { styled } from '@mui/material/styles';

const StyledQuickFilter = styled(QuickFilter)({
  flex: 1,
});

function CalendarHeader() {
  const {
    currentDate,
    isDatePickerOpen,
    dateConstraints,
    setIsDatePickerOpen,
    handlePreviousMonth,
    handleNextMonth,
    handleDateChange,
  } = useCalendarContext();
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        gap: { xs: 2, sm: 3 },
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          flexShrink: 0,
        }}
      >
        <IconButton
          onClick={handlePreviousMonth}
          size="small"
          sx={{
            color: 'text.primary',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          <ChevronLeft />
        </IconButton>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            value={currentDate}
            onChange={handleDateChange}
            open={isDatePickerOpen}
            onOpen={() => setIsDatePickerOpen(true)}
            onClose={() => setIsDatePickerOpen(false)}
            minDate={dateConstraints.minDate}
            maxDate={dateConstraints.maxDate}
            views={['month', 'year']}
            slotProps={{
              textField: {
                onClick: () => setIsDatePickerOpen(true),
                sx: {
                  '& .MuiInputBase-root': {
                    height: '40px',
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '& .MuiInputBase-input': {
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  },
                  '& .MuiInputAdornment-root': {
                    display: 'none',
                  },
                },
              },
              popper: {
                sx: {
                  '& .MuiPaper-root': {
                    borderRadius: '12px',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                  },
                  '& .MuiPickersCalendarHeader-root': {
                    marginTop: '8px',
                  },
                },
              },
            }}
          />
        </LocalizationProvider>
        <IconButton
          onClick={handleNextMonth}
          size="small"
          sx={{
            color: 'text.primary',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          <ChevronRight />
        </IconButton>
        <Button
          variant="outlined"
          onClick={() => handleDateChange(new Date(2025, 4, 1))}
          sx={{
            borderColor: '#000000',
            borderRadius: 2,
            whiteSpace: 'nowrap',
            minWidth: '100px',
            textTransform: 'none',
            color: '#000000',
            height: '40px',
            backgroundColor: '#ffffff',
            fontWeight: 'bold',
          }}
        >
          Today
        </Button>
      </Box>

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
              placeholder="Search"
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
    </Box>
  );
}

export { CalendarHeader };
