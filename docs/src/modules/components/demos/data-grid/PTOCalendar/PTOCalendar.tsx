'use client';

import React, { useMemo, useEffect } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import {
  DataGridPro,
  GridColDef,
  GridRenderCellParams,
  GridPinnedRowsProp,
} from '@mui/x-data-grid-pro';
import BeachAccess from '@mui/icons-material/BeachAccess';
import Cake from '@mui/icons-material/Cake';
import Sick from '@mui/icons-material/Sick';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { getHolidaysForCountries } from './data/holidays';
import { useCalendarState } from './hooks/useCalendarState';
import { usePTOData } from './hooks/usePTOData';
import { CalendarHeader } from './CalendarHeader';
import { FilterChips } from './FilterChips';
import { findContinuousPeriods, isCurrentDay } from './utils/dateUtils';
import { HolidayData } from './types/pto';

interface RowData {
  id: number;
  employee: string;
  [key: string]:
    | string
    | number
    | boolean
    | {
        hasPTO: boolean;
        hasSick: boolean;
        hasHoliday: boolean;
        show: boolean;
      };
}

const PTOCalendar: React.FC = () => {
  const {
    currentDate,
    searchQuery,
    isDatePickerOpen,
    activeFilters,
    dateConstraints,
    handlePreviousMonth,
    handleNextMonth,
    handleDateChange,
    handleSearchChange,
    handleFilterRemove,
    handleFilterAdd,
    setIsDatePickerOpen,
  } = useCalendarState();

  const [holidays, setHolidays] = React.useState<HolidayData>({});
  const ptoData = usePTOData(currentDate);

  const monthStart = useMemo(() => startOfMonth(currentDate), [currentDate]);
  const monthEnd = useMemo(() => endOfMonth(currentDate), [currentDate]);
  const daysToShow = useMemo(
    () => eachDayOfInterval({ start: monthStart, end: monthEnd }),
    [monthStart, monthEnd],
  );

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const year = currentDate.getFullYear();
        const countries = Array.from(
          new Set(Object.values(ptoData).map((data) => data.nationality)),
        );
        const holidayData = await getHolidaysForCountries(year, countries);
        setHolidays(holidayData);
      } catch (error) {
        console.error('Failed to fetch holidays:', error);
        // TODO: Add proper error handling UI
      }
    };

    fetchHolidays();
  }, [currentDate, ptoData]);

  const employeesOutOfOffice = useMemo(() => {
    const summary: { [key: string]: number } = {};

    daysToShow.forEach((day) => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const count = Object.values(ptoData).filter(
        (data) => data.ptoDates.includes(dateStr) || data.sickDates.includes(dateStr),
      ).length;
      summary[dateStr] = count;
    });

    return summary;
  }, [daysToShow, ptoData]);

  const pinnedRow: GridPinnedRowsProp = {
    top: [
      {
        id: 'summary',
        employee: 'Out of office:',
        ...Object.fromEntries(
          daysToShow.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            return [dateStr, employeesOutOfOffice[dateStr]];
          }),
        ),
      },
    ],
  };

  const filteredRows = useMemo(() => {
    const allRows = Object.entries(ptoData).map(([name, data], index) => {
      const row: RowData = {
        id: index + 1,
        employee: name,
      };

      daysToShow.forEach((day) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const hasPTO = data.ptoDates.includes(dateStr);
        const hasSick = data.sickDates.includes(dateStr);
        const hasHoliday = Boolean(holidays[data.nationality]?.[dateStr]);

        row[dateStr] = {
          hasPTO,
          hasSick,
          hasHoliday,
          show:
            (hasPTO && activeFilters.includes('vacation')) ||
            (hasSick && activeFilters.includes('sick')) ||
            (hasHoliday && activeFilters.includes('holidays')),
        };
      });

      return row;
    });

    if (!searchQuery) return allRows;

    const query = searchQuery.toLowerCase();
    return allRows.filter((row) => row.employee.toLowerCase().includes(query));
  }, [daysToShow, searchQuery, activeFilters, holidays, ptoData]);

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: 'employee',
        headerName: 'Employees',
        flex: 0,
        minWidth: 200,
        maxWidth: 220,
        fixed: true,
        headerAlign: 'left' as const,
        align: 'left' as const,
        renderCell: (params: GridRenderCellParams) => {
          if (params.row.id === 'summary') {
            return (
              <Typography
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  paddingLeft: '16px',
                }}
              >
                {params.value}
              </Typography>
            );
          }

          const initials = params.value
            .split(' ')
            .map((name: string) => name[0])
            .join('');

          return (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                pl: 1,
                gap: 1,
                py: 1,
              }}
            >
              <Avatar
                src={`/assets/${ptoData[params.value].avatar}.jpg`}
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: '#e1d7fb',
                  borderTopLeftRadius: 0,
                  color: '#1f1f20',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  border: '1px solid #fafafa',
                  flexShrink: 0,
                }}
              >
                {initials}
              </Avatar>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, minWidth: 0 }}>
                <Typography
                  sx={{
                    flex: 1,
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                    lineHeight: 1,
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {params.value}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    color: 'text.secondary',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {ptoData[params.value].team}
                </Typography>
              </Box>
            </Box>
          );
        },
      },
      ...daysToShow.map((day) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const isCurrent = isCurrentDay(day);

        return {
          field: dateStr,
          headerName: format(day, 'EEE d'),
          description: format(day, 'MMMM d, yyyy'),
          flex: 1,
          minWidth: 40,
          editable: true,
          type: 'boolean' as const,
          headerAlign: 'center' as const,
          align: 'center' as const,
          renderHeader: () => (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                height: '100%',
                py: 0,
                justifyContent: 'center',
                backgroundColor: isCurrent ? '#f7f6f9' : 'transparent',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 'bold',
                  color: isCurrent ? '#3E63DD' : 'text.secondary',
                  fontSize: '0.75rem',
                  lineHeight: 1,
                  mb: 0,
                }}
              >
                {format(day, 'd')}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: isCurrent ? '#3E63DD' : 'text.secondary',
                  fontWeight: isCurrent ? 'bold' : 'normal',
                  fontSize: '0.7rem',
                  lineHeight: 1,
                  mt: 0,
                }}
              >
                {format(day, 'EEE')}
              </Typography>
            </Box>
          ),
          renderCell: (params: GridRenderCellParams) => {
            if (params.row.id === 'summary') {
              const count = params.value as number;
              return (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isCurrent ? '#f7f6f9' : '#f7f6f9',
                    color: isCurrent ? '#3E63DD' : 'text.secondary',
                    fontWeight: 'bold',
                    fontSize: '0.7rem',
                  }}
                >
                  {count > 0 ? count : '0'}
                </Box>
              );
            }

            const cellData = params.value as {
              hasPTO: boolean;
              hasSick: boolean;
              hasHoliday: boolean;
              show: boolean;
            };
            if (!cellData.show) return null;

            const ptoPeriods = findContinuousPeriods(ptoData[params.row.employee].ptoDates || []);
            const sickPeriods = findContinuousPeriods(ptoData[params.row.employee].sickDates || []);
            const currentPTOPeriod = ptoPeriods.find((period) => period.includes(params.field));
            const currentSickPeriod = sickPeriods.find((period) => period.includes(params.field));
            const isFirstDayOfPTO = currentPTOPeriod && currentPTOPeriod[0] === params.field;
            const isFirstDayOfSick = currentSickPeriod && currentSickPeriod[0] === params.field;
            const showPTO = cellData.hasPTO && activeFilters.includes('vacation');
            const showSick = cellData.hasSick && activeFilters.includes('sick');
            const showHoliday = cellData.hasHoliday && activeFilters.includes('holidays');
            const holidayName = showHoliday
              ? holidays[ptoData[params.row.employee].nationality][params.field]
              : '';

            const isBirthday = format(day, 'MM-dd') === ptoData[params.row.employee].birthday;

            return (
              <Box
                sx={{
                  width: '100%',
                  height: showPTO || showSick ? '42px' : '100%',
                  borderRadius: showPTO
                    ? currentPTOPeriod?.length === 1
                      ? '20px'
                      : currentPTOPeriod?.[0] === params.field
                        ? '20px 0 0 20px'
                        : currentPTOPeriod?.[currentPTOPeriod.length - 1] === params.field
                          ? '0 20px 20px 0'
                          : '0'
                    : showSick
                      ? currentSickPeriod?.length === 1
                        ? '20px'
                        : currentSickPeriod?.[0] === params.field
                          ? '20px 0 0 20px'
                          : currentSickPeriod?.[currentSickPeriod.length - 1] === params.field
                            ? '0 20px 20px 0'
                            : '0'
                      : '0',
                  backgroundColor: showPTO
                    ? '#C3E9D7' // --jade-5
                    : showSick
                      ? '#fffaa0'
                      : isCurrent
                        ? '#f7f6f9'
                        : 'transparent',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                  color:
                    showPTO || showSick
                      ? isCurrent
                        ? '#ffffff'
                        : 'text.secondary'
                      : 'transparent',
                  '&:hover': {
                    backgroundColor:
                      showPTO || showSick ? 'none' : isCurrent ? '#c7e2fe' : '#e3f2fd',
                  },
                  border: showPTO ? '2px solid #C3E9D7' : showSick ? '2px solid #fffaa0' : 'none',
                  alignSelf: 'center',
                }}
              >
                {isFirstDayOfPTO && showPTO && (
                  <BeachAccess sx={{ fontSize: '1rem', color: '#208368' /* --jade-11 */ }} />
                )}
                {isFirstDayOfSick && showSick && (
                  <Sick sx={{ fontSize: '1rem', color: '#807d50' }} />
                )}
                {isBirthday && cellData.show && (
                  <Cake sx={{ fontSize: '1rem', color: '#75758d' }} />
                )}
                {showHoliday && (
                  <Tooltip title={holidayName}>
                    <Box
                      component="img"
                      src={`https://flagcdn.com/w20/${ptoData[params.row.employee].nationality.toLowerCase()}.png`}
                      alt={`${ptoData[params.row.employee].nationality} flag`}
                      sx={{
                        width: 16,
                        height: 16,
                        opacity: 0.9,
                        borderRadius: '50%',
                        border: '2px solid #D2DEFF',
                      }}
                    />
                  </Tooltip>
                )}
              </Box>
            );
          },
        };
      }),
    ],
    [daysToShow, holidays, ptoData, activeFilters],
  );

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        py: 3,
        overflow: 'hidden',
      }}
    >
      {/* <Typography
        variant="h4"
        sx={{
          mb: 3,
          pl: 1,
          fontWeight: 'bold',
        }}
      >
        Time Off Calendar
      </Typography> */}
      <Box
        sx={{
          width: '100%',
          backgroundColor: '#ffffff',
          borderRadius: 1,
          p: { xs: 2, sm: 3 },
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 2, sm: 3 },
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <CalendarHeader
          currentDate={currentDate}
          searchQuery={searchQuery}
          isDatePickerOpen={isDatePickerOpen}
          dateConstraints={dateConstraints}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
          onDateChange={handleDateChange}
          onSearchChange={handleSearchChange}
          onDatePickerOpen={() => setIsDatePickerOpen(true)}
          onDatePickerClose={() => setIsDatePickerOpen(false)}
        />

        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 2,
            pl: 1,
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
            employeeCount={Object.keys(ptoData).length}
          />
        </Box>
        <Divider />
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minHeight: 0,
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              borderRadius: 1,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <DataGridPro
              pinnedRows={pinnedRow}
              rows={filteredRows}
              columns={columns}
              initialState={{
                pinnedColumns: {
                  left: ['employee'],
                },
                pagination: {
                  paginationModel: { pageSize: 5 },
                },
              }}
              pageSizeOptions={[5]}
              checkboxSelection={false}
              disableRowSelectionOnClick
              hideFooter
              columnHeaderHeight={40}
              rowHeight={50}
              getRowHeight={(params) => {
                if (params.model.id === 'summary') {
                  return 40;
                }
                return 50;
              }}
              sx={{
                border: 'none',
                height: '100%',
                '& .MuiDataGrid-main': {
                  border: 'none',
                },
                '& .MuiDataGrid-virtualScroller': {
                  overflow: 'auto',
                },
                '& .MuiDataGrid-filler--pinnedLeft': {
                  borderRight: 'none',
                },
                '& .MuiDataGrid-cell': {
                  cursor: 'pointer',
                  p: 0,
                  border: 'none',
                  '&:not([data-field="employee"])': {
                    border: '0.75px solid #EAE7EC',
                  },
                },
                '& .MuiDataGrid-columnHeader': {
                  p: 0,
                  backgroundColor: '#f7f6f9',
                  border: 'none',
                  '&:not([data-field="employee"])': {
                    border: '0.75px solid #EAE7EC',
                    borderTop: '0.75px solid #EAE7EC',
                  },
                },
                '& .MuiDataGrid-columnHeaderTitleContainer': {
                  p: 0,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  color: '#75758d',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: 'rgba(250,250,250,255)',
                  '& .MuiDataGrid-columnHeader:first-of-type:not([data-field="employee"])': {
                    borderTopLeftRadius: '10px',
                  },
                  '& .MuiDataGrid-columnHeader:last-of-type': {
                    borderTopRightRadius: '10px',
                  },
                },
                '& .MuiDataGrid-columnSeparator': {
                  display: 'none',
                },
                '& .MuiDataGrid-cell[data-field="employee"]': {
                  padding: '12px 8px',
                  color: '#09090b',
                  borderRight: 'none',
                },
                '& .MuiDataGrid-columnHeader[data-field="employee"]': {
                  padding: '8px',
                  borderRight: 'none',
                  '& .MuiDataGrid-columnHeaderTitleContainer': {
                    pl: 2,
                    '& .MuiDataGrid-columnHeaderTitle': {
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      color: '#75758d',
                    },
                  },
                },
                '& .MuiDataGrid-pinnedRows': {
                  backgroundColor: '#f7f6f9',
                  mb: '5px',
                  '& .MuiDataGrid-cell': {
                    border: 'none',
                  },
                },
                '& .MuiDataGrid-pinnedRows .MuiDataGrid-cell[data-field="employee"]': {
                  backgroundColor: '#f7f6f9',
                },
                '& .MuiDataGrid-virtualScrollerContent': {
                  '& .MuiDataGrid-row:last-child': {
                    '& .MuiDataGrid-cell:not([data-field="employee"])': {
                      borderBottom: '0.75px solid #EAE7EC',
                    },
                    '& .MuiDataGrid-cell:first-of-type:not([data-field="employee"])': {
                      borderBottomLeftRadius: '10px',
                    },
                    '& .MuiDataGrid-cell:last-of-type': {
                      borderBottomRightRadius: '10px',
                    },
                  },
                },
                [`& .MuiDataGrid-columnHeader[data-field="${format(new Date(), 'yyyy-MM-dd')}"]`]: {
                  backgroundColor: '#f7f6f9',
                },
                [`& .MuiDataGrid-cell[data-field="${format(new Date(), 'yyyy-MM-dd')}"]`]: {
                  backgroundColor: '#f7f6f9',
                },
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PTOCalendar;
