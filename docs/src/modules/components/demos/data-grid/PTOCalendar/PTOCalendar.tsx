import React, { useMemo, useEffect } from 'react';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import {
  DataGridPro,
  GridColDef,
  GridRenderCellParams,
  GridPinnedRowsProp,
  useGridApiContext,
  useGridSelector,
  gridFilteredRowCountSelector,
} from '@mui/x-data-grid-pro';
import BeachAccess from '@mui/icons-material/BeachAccess';
import Cake from '@mui/icons-material/Cake';
import Sick from '@mui/icons-material/Sick';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { getHolidaysForCountries } from './data/holidays';
import { useCalendarState } from './hooks/useCalendarState';
import { usePTOData } from './hooks/usePTOData';
import { findContinuousPeriods, isCurrentDay } from './utils/dateUtils';
import { HolidayData } from './types/pto';
import { CalendarContext } from './CalendarContext';
import { CalendarToolbar } from './CalendarToolbar';
import { FILTER_COLORS } from './constants';

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

function EmployeeHeader() {
  const apiRef = useGridApiContext();
  const filteredRowCount = useGridSelector(apiRef, gridFilteredRowCountSelector);
  return (
    <Typography fontWeight="bold" fontSize="0.75rem" color="text.primary">
      Employees ({filteredRowCount})
    </Typography>
  );
}

function PTOCalendar() {
  const theme = useTheme();
  const calendarState = useCalendarState();
  const { currentDate, activeFilters } = calendarState;

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

  const rows = useMemo(() => {
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

    return allRows;
  }, [daysToShow, activeFilters, holidays, ptoData]);

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
        renderHeader: EmployeeHeader,
        renderCell: (params: GridRenderCellParams) => {
          if (params.row.id === 'summary') {
            return (
              <Typography
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  paddingLeft: 1.25,
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
                    color: 'text.primary',
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
                backgroundColor: isCurrent ? '#faf9fb' : 'transparent',
                ...theme.applyStyles('dark', {
                  backgroundColor: isCurrent ? '#1e2429' : 'transparent',
                }),
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 'bold',
                  color: isCurrent ? '#3E63DD' : 'text.primary',
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
              const isCurrent = isCurrentDay(day);
              return (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
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
                    ? FILTER_COLORS.vacation.background
                    : showSick
                      ? FILTER_COLORS.sick.background
                      : isCurrent
                        ? '#faf9fb'
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
                        : showPTO
                          ? FILTER_COLORS.vacation.text
                          : FILTER_COLORS.sick.text
                      : 'transparent',
                  '&:hover': {
                    backgroundColor:
                      showPTO || showSick ? 'none' : isCurrent ? '#c7e2fe' : '#e3f2fd',
                  },
                  border: showPTO
                    ? `2px solid ${FILTER_COLORS.vacation.border}`
                    : showSick
                      ? `2px solid ${FILTER_COLORS.sick.border}`
                      : 'none',
                  alignSelf: 'center',
                  ...theme.applyStyles('dark', {
                    backgroundColor: showPTO
                      ? FILTER_COLORS.vacation.dark.background
                      : showSick
                        ? FILTER_COLORS.sick.dark.background
                        : isCurrent
                          ? '#1e2429'
                          : 'transparent',
                    borderColor: showPTO
                      ? FILTER_COLORS.vacation.dark.border
                      : showSick
                        ? FILTER_COLORS.sick.dark.border
                        : 'transparent',
                    color: showPTO
                      ? FILTER_COLORS.vacation.dark.text
                      : showSick
                        ? FILTER_COLORS.sick.dark.text
                        : 'transparent',
                    '&:hover': {
                      backgroundColor:
                        showPTO || showSick ? 'none' : isCurrent ? 'transparent' : '#1e2429',
                    },
                  }),
                }}
              >
                {isFirstDayOfPTO && showPTO && (
                  <BeachAccess
                    sx={{
                      fontSize: '1rem',
                      color: FILTER_COLORS.vacation.text,
                      ...theme.applyStyles('dark', {
                        color: FILTER_COLORS.vacation.dark.text,
                      }),
                    }}
                  />
                )}
                {isFirstDayOfSick && showSick && (
                  <Sick
                    sx={{
                      fontSize: '1rem',
                      color: FILTER_COLORS.sick.text,
                      ...theme.applyStyles('dark', {
                        color: FILTER_COLORS.sick.dark.text,
                      }),
                    }}
                  />
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
                        border: `2px solid ${FILTER_COLORS.holidays.border}`,
                        ...theme.applyStyles('dark', {
                          border: `2px solid text.primary`,
                        }),
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
    <CalendarContext.Provider value={calendarState}>
      <Box
        sx={{
          width: '100%',
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 2, sm: 3 },
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          ...theme.applyStyles('dark', {
            backgroundColor: '#141A1F',
          }),
        }}
      >
        <DataGridPro
          pinnedRows={pinnedRow}
          rows={rows}
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
          showCellVerticalBorder
          slots={{ toolbar: CalendarToolbar }}
          showToolbar
          getRowHeight={(params) => {
            if (params.model.id === 'summary') {
              return 40;
            }
            return 50;
          }}
          sx={{
            border: 'none',
            height: '100%',
            '--DataGrid-rowBorderColor': '#EEEBF0',
            ...theme.applyStyles('dark', {
              '--DataGrid-rowBorderColor': '#38363E',
            }),
            '& .MuiDataGrid-virtualScroller': {
              overflow: 'auto',
              ...theme.applyStyles('dark', {
                backgroundColor: '#141A1F',
              }),
            },
            '& .MuiDataGrid-cell': {
              cursor: 'pointer',
              p: 0,
              ...theme.applyStyles('dark', {
                backgroundColor: '#141A1F',
              }),
            },
            '& .MuiDataGrid-row': {
              '&:hover': {
                '& .MuiDataGrid-cell': {
                  backgroundColor: '#f7f9ff',
                  ...theme.applyStyles('dark', {
                    backgroundColor: '#1e2933',
                  }),
                },
              },
            },
            '& .MuiDataGrid-columnHeader': {
              p: 0,
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
              padding: '12px 6px',
              color: '#09090b',
              borderTopColor: 'transparent',
            },
            '& .MuiDataGrid-columnHeader[data-field="employee"]': {
              padding: '8px',
              '& .MuiDataGrid-columnHeaderTitleContainer': {
                pl: 1,
                '& .MuiDataGrid-columnHeaderTitle': {
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  color: '#75758d',
                },
              },
            },
            '& .MuiDataGrid-pinnedRows .MuiDataGrid-cell:not(.MuiDataGrid-cell--pinnedLeft)': {
              borderRight: 0,
            },
            '& .MuiDataGrid-pinnedRows .MuiDataGrid-cell': {
              backgroundColor: '#faf9fb',
              ...theme.applyStyles('dark', {
                backgroundColor: '#1e2429',
              }),
            },
            '& .MuiDataGrid-virtualScrollerContent': {
              '& .MuiDataGrid-row:last-child': {
                '& .MuiDataGrid-cell:first-of-type:not([data-field="employee"])': {
                  borderBottomLeftRadius: '10px',
                },
                '& .MuiDataGrid-cell:last-of-type': {
                  borderBottomRightRadius: '10px',
                },
              },
            },
          }}
        />
      </Box>
    </CalendarContext.Provider>
  );
}

function PTOCalendarContainer() {
  const docsTheme = useTheme();
  const docsMode = docsTheme?.palette?.mode;

  const theme = React.useMemo(() => {
    const resultTheme = createTheme({
      colorSchemes: {
        light: {
          palette: {
            divider: '#EEEBF0',
            DataGrid: {
              bg: '#fff',
              pinnedBg: '#fff',
              headerBg: '#faf9fb',
            },
          },
        },
        dark: {
          palette: {
            divider: '#38363E',
            DataGrid: {
              bg: '#141A1F',
              pinnedBg: '#141A1F',
              headerBg: '#1e2429',
            },
          },
        },
      },
    });

    if (docsMode) {
      Object.assign(resultTheme, resultTheme.colorSchemes[docsMode]);
    }

    return resultTheme;
  }, [docsMode]);

  return (
    <ThemeProvider theme={theme}>
      <PTOCalendar />
    </ThemeProvider>
  );
}

export default PTOCalendarContainer;
