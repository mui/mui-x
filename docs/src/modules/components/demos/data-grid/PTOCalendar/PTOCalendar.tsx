import React, { useMemo, useEffect } from 'react';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import {
  DataGridPremium,
  GridColDef,
  GridRenderCellParams,
  GridPinnedRowsProp,
  useGridApiContext,
  useGridSelector,
  gridFilteredRowCountSelector,
} from '@mui/x-data-grid-premium';
import Cake from '@mui/icons-material/Cake';
import BeachAccessOutlined from '@mui/icons-material/BeachAccessOutlined';
import DeviceThermostatOutlined from '@mui/icons-material/DeviceThermostatOutlined';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfDay } from 'date-fns';
import { getHolidaysForCountries } from './data/holidays';
import { useCalendarState } from './hooks/useCalendarState';
import { usePTOData } from './hooks/usePTOData';
import { findContinuousPeriods, isCurrentDay } from './utils/dateUtils';
import { HolidayData } from './types/pto';
import { CalendarContext } from './CalendarContext';
import { CalendarToolbar } from './CalendarToolbar';
import { FILTER_COLORS } from './constants';
import type {} from '@mui/x-data-grid-premium/themeAugmentation';

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
        hasHolidayBooked: boolean;
        show: boolean;
      };
}

interface CellData {
  hasPTO: boolean;
  hasSick: boolean;
  hasHoliday: boolean;
  hasHolidayBooked: boolean;
  show: boolean;
}

function EmployeeHeader() {
  const apiRef = useGridApiContext();
  const filteredRowCount = useGridSelector(apiRef, gridFilteredRowCountSelector);
  return (
    <Typography fontWeight="medium" fontSize="0.875rem">
      Employees ({filteredRowCount})
    </Typography>
  );
}

type PTOParams = GridRenderCellParams<RowData, CellData>;
function getIsFirstVisibleDayOfPTO(
  params: PTOParams,
  daysToShow: Date[],
  activeFilters: string[],
  isFirstDayOfPTO: boolean,
): boolean {
  if (!params.value?.hasPTO) return false;
  if (isFirstDayOfPTO) return true;
  const prevDayIndex = daysToShow.findIndex((d) => format(d, 'yyyy-MM-dd') === params.field) - 1;
  if (prevDayIndex >= 0) {
    const prevDayStr = format(daysToShow[prevDayIndex], 'yyyy-MM-dd');
    const prevCell = (params.row as Record<string, CellData>)[prevDayStr];
    if (prevCell && prevCell.hasHoliday && activeFilters.includes('holidays')) {
      return true;
    }
  }
  return false;
}

interface TooltipTitleParams {
  showHoliday: boolean;
  hasHolidayBooked: boolean;
  holidayName: string;
  showPTO: boolean;
  currentPTOPeriod: string[] | undefined;
  showSick: boolean;
  currentSickPeriod: string[] | undefined;
}
function getCellTooltipTitle({
  showHoliday,
  hasHolidayBooked,
  holidayName,
  showPTO,
  currentPTOPeriod,
  showSick,
  currentSickPeriod,
}: TooltipTitleParams): string {
  if (showHoliday && hasHolidayBooked) return `${holidayName} (booked as PTO)`;
  if (showHoliday) return `${holidayName}`;
  if (showPTO)
    return `Vacation (${currentPTOPeriod?.length} day${currentPTOPeriod?.length === 1 ? '' : 's'})`;
  if (showSick)
    return `Sick leave (${currentSickPeriod?.length} day${currentSickPeriod?.length === 1 ? '' : 's'})`;
  return '';
}

interface RenderCellIconLabelParams {
  showHoliday: boolean;
  ptoData: any;
  params: PTOParams;
  isFirstVisibleDayOfPTO: boolean;
  showPTO: boolean;
  isFirstDayOfSick: boolean;
  showSick: boolean;
  isBirthday: boolean;
  cellData: CellData;
  showLabel: boolean;
}
function renderCellIconLabel({
  showHoliday,
  ptoData,
  params,
  isFirstVisibleDayOfPTO,
  showPTO,
  isFirstDayOfSick,
  showLabel,
  showSick,
  isBirthday,
  cellData,
}: RenderCellIconLabelParams) {
  if (showHoliday) {
    return (
      <>
        <Box
          component="img"
          src={`https://flagcdn.com/w40/${ptoData[params.row.employee].nationality.toLowerCase()}.png`}
          alt={`${ptoData[params.row.employee].nationality} flag`}
          sx={{
            width: 18,
            height: 18,
            margin: '1px',
            borderRadius: '50%',
          }}
        />
        {showLabel && 'Holiday'}
      </>
    );
  }
  if (isFirstVisibleDayOfPTO && showPTO) {
    return (
      <>
        <BeachAccessOutlined fontSize="small" />
        {showLabel && 'Vacation'}
      </>
    );
  }
  if (isFirstDayOfSick && showSick) {
    return (
      <>
        <DeviceThermostatOutlined fontSize="small" />
        {showLabel && 'Sick leave'}
      </>
    );
  }
  if (isBirthday && cellData.show) {
    return (
      <>
        <Cake fontSize="small" />
        {showLabel && 'Birthday'}
      </>
    );
  }
  return null;
}

function PTOCalendar() {
  const theme = useTheme();
  const calendarState = useCalendarState();
  const { currentDate, activeFilters, density } = calendarState;

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

  const pinnedRow: GridPinnedRowsProp = React.useMemo(
    () => ({
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
    }),
    [daysToShow, employeesOutOfOffice],
  );

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
        const hasHoliday = !!holidays[data.nationality]?.[dateStr];

        row[dateStr] = {
          hasPTO,
          hasSick,
          hasHoliday,
          hasHolidayBooked: hasHoliday && hasPTO,
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
        width: 190,
        renderHeader: EmployeeHeader,
        renderCell: (params: GridRenderCellParams) => {
          if (params.row.id === 'summary') {
            return (
              <Typography
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.8125rem',
                  fontWeight: 'medium',
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
                gap: 1,
              }}
            >
              <Avatar
                src={`/assets/${ptoData[params.value].avatar}.jpg`} // TODO: add assets to docs
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: '#e1d7fb',
                  color: '#1f1f20',
                  fontSize: '0.75rem',
                  fontWeight: 'medium',
                  border: '1px solid #fafafa',
                  flexShrink: 0,
                }}
              >
                {initials}
              </Avatar>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, minWidth: 0 }}>
                <Typography
                  sx={{
                    color: 'text.primary',
                    flex: 1,
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                    lineHeight: 1,
                    fontSize: '0.875rem',
                    fontWeight: 'medium',
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
          width: density === 'compact' ? 50 : 120,
          type: 'boolean' as const,
          renderHeader: () => (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.75,
              }}
            >
              <Typography
                variant="caption"
                sx={(theme) => ({
                  color: isCurrent ? '#6550b9' : '#494657',
                  fontWeight: isCurrent ? 'medium' : 'regular',
                  fontSize: '0.75rem',
                  lineHeight: 1,
                  textTransform: 'none',
                  ...theme.applyStyles('dark', {
                    color: isCurrent ? '#aa99ec' : '#faf8ff',
                  }),
                })}
              >
                {format(day, density === 'compact' ? 'eee' : 'eeee')}
              </Typography>
              <Typography
                variant="body2"
                sx={(theme) => ({
                  fontWeight: 'medium',
                  color: isCurrent ? '#6550b9' : '#494657',
                  fontSize: '1rem',
                  lineHeight: 1,
                  ...theme.applyStyles('dark', {
                    color: isCurrent ? '#aa99ec' : '#faf8ff',
                  }),
                })}
              >
                {format(day, 'd')}
              </Typography>
            </Box>
          ),
          colSpan: (value: any, row: any, column: any) => {
            if (row.id === 'summary') return 1;
            if (!value.show) return 1;

            const fields = Object.keys(row).filter((f) => f !== 'id' && f !== 'employee');
            const colIndex = fields.indexOf(column.field);
            const currentCellType =
              value.hasHoliday && activeFilters.includes('holidays')
                ? 'holidays'
                : value.hasPTO
                  ? 'vacation'
                  : value.hasSick
                    ? 'sick'
                    : '';

            let span = 1;
            for (let i = colIndex + 1; i < fields.length; i++) {
              const nextCell = row[fields[i]];
              if (!nextCell?.show || (nextCell.hasHoliday && activeFilters.includes('holidays')))
                break;

              const nextCellType =
                nextCell.hasHoliday && activeFilters.includes('holidays')
                  ? 'holidays'
                  : nextCell.hasPTO
                    ? 'vacation'
                    : nextCell.hasSick
                      ? 'sick'
                      : '';
              if (nextCellType !== currentCellType) break;

              span++;
            }
            return span;
          },
          renderCell: (params: GridRenderCellParams) => {
            if (params.row.id === 'summary') {
              const count = params.value;
              const isCurrent = isCurrentDay(day);
              return (
                <Box
                  sx={(theme) => ({
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isCurrent ? '#6550b9' : '#76747f',
                    fontWeight: 'medium',
                    fontSize: '0.8125rem',
                    ...theme.applyStyles('dark', {
                      color: isCurrent ? '#aa99ec' : '#faf8ff',
                    }),
                  })}
                >
                  {count > 0 ? count : '0'}
                </Box>
              );
            }

            const cellData = params.value as {
              hasPTO: boolean;
              hasSick: boolean;
              hasHoliday: boolean;
              hasHolidayBooked: boolean;
              show: boolean;
            };
            if (!cellData.show) return null;

            const ptoPeriods = findContinuousPeriods(ptoData[params.row.employee].ptoDates || []);
            const sickPeriods = findContinuousPeriods(ptoData[params.row.employee].sickDates || []);
            const currentPTOPeriod = ptoPeriods.find((period) => period.includes(params.field));
            const currentSickPeriod = sickPeriods.find((period) => period.includes(params.field));
            const isFirstDayOfPTO = currentPTOPeriod && currentPTOPeriod[0] === params.field;
            const isFirstDayOfSick = currentSickPeriod && currentSickPeriod[0] === params.field;
            const isMiddleOfPeriod = !isFirstDayOfPTO && !isFirstDayOfSick;
            const lastDayOfPeriod = daysToShow[daysToShow.length - 1];
            const isEndOfPTOPeriodInRange =
              currentPTOPeriod &&
              startOfDay(new Date(currentPTOPeriod[currentPTOPeriod.length - 1])) <=
                startOfDay(lastDayOfPeriod);
            const isEndOfSickPeriodInRange =
              currentSickPeriod &&
              startOfDay(new Date(currentSickPeriod[currentSickPeriod.length - 1])) <=
                startOfDay(lastDayOfPeriod);
            const isEndOfPeriodInRange = isEndOfPTOPeriodInRange || isEndOfSickPeriodInRange;
            const showPTO = cellData.hasPTO && activeFilters.includes('vacation');
            const showSick = cellData.hasSick && activeFilters.includes('sick');
            const showHoliday = cellData.hasHoliday && activeFilters.includes('holidays');

            const holidayName = showHoliday
              ? holidays[ptoData[params.row.employee].nationality][params.field]
              : '';
            const isBirthday = format(day, 'MM-dd') === ptoData[params.row.employee].birthday;

            const isFirstVisibleDayOfPTO = getIsFirstVisibleDayOfPTO(
              params,
              daysToShow,
              activeFilters,
              !!isFirstDayOfPTO,
            );
            const title = getCellTooltipTitle({
              showHoliday,
              hasHolidayBooked: cellData.hasHolidayBooked,
              holidayName,
              showPTO,
              currentPTOPeriod,
              showSick,
              currentSickPeriod,
            });
            return (
              <Tooltip
                title={title}
                slotProps={{
                  popper: {
                    modifiers: [
                      {
                        name: 'offset',
                        options: {
                          offset: [0, 10],
                        },
                      },
                    ],
                  },
                }}
                disableInteractive
                followCursor
              >
                <Box
                  sx={{
                    width: '100%',
                    userSelect: 'none',
                    height: showPTO || showSick || showHoliday ? '40px' : '100%',
                    marginLeft:
                      !isMiddleOfPeriod || showHoliday || isFirstVisibleDayOfPTO ? 0.5 : 0,
                    marginRight: isEndOfPeriodInRange || showHoliday ? 0.5 : 0,
                    borderTopLeftRadius:
                      !isMiddleOfPeriod || showHoliday || isFirstVisibleDayOfPTO ? '12px' : 0,
                    borderBottomLeftRadius:
                      !isMiddleOfPeriod || showHoliday || isFirstVisibleDayOfPTO ? '12px' : 0,
                    borderTopRightRadius: isEndOfPeriodInRange || showHoliday ? '12px' : '0',
                    borderBottomRightRadius: isEndOfPeriodInRange || showHoliday ? '12px' : '0',
                    backgroundColor:
                      showHoliday && cellData.hasHolidayBooked
                        ? FILTER_COLORS.holidays.background
                        : showHoliday
                          ? 'transparent'
                          : showPTO
                            ? FILTER_COLORS.vacation.background
                            : showSick
                              ? FILTER_COLORS.sick.background
                              : isCurrent
                                ? '#faf9fb'
                                : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: density === 'comfortable' ? 'start' : 'center',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    px: 1.5,
                    fontSize: '0.8125rem',
                    fontWeight: 'medium',
                    gap: 0.5,
                    color:
                      showHoliday && cellData.hasHolidayBooked
                        ? FILTER_COLORS.holidays.text
                        : showHoliday
                          ? FILTER_COLORS.holidays.text
                          : showPTO
                            ? FILTER_COLORS.vacation.text
                            : showSick
                              ? FILTER_COLORS.sick.text
                              : 'transparent',
                    border:
                      showHoliday && cellData.hasHolidayBooked
                        ? `1px solid ${FILTER_COLORS.holidays.border}`
                        : showHoliday
                          ? `1px dashed ${FILTER_COLORS.holidays.border}`
                          : showPTO
                            ? `1px solid ${FILTER_COLORS.vacation.border}`
                            : showSick
                              ? `1px solid ${FILTER_COLORS.sick.border}`
                              : 'none',
                    alignSelf: 'center',
                    ...theme.applyStyles('dark', {
                      backgroundColor:
                        showHoliday && cellData.hasHolidayBooked
                          ? FILTER_COLORS.holidays.dark.background
                          : showHoliday
                            ? 'transparent'
                            : showPTO
                              ? FILTER_COLORS.vacation.dark.background
                              : showSick
                                ? FILTER_COLORS.sick.dark.background
                                : isCurrent
                                  ? '#1e2429'
                                  : 'transparent',
                      borderColor:
                        showHoliday && cellData.hasHolidayBooked
                          ? FILTER_COLORS.holidays.dark.border
                          : showHoliday
                            ? FILTER_COLORS.holidays.dark.border
                            : showPTO
                              ? FILTER_COLORS.vacation.dark.border
                              : showSick
                                ? FILTER_COLORS.sick.dark.border
                                : 'transparent',
                      color:
                        showHoliday && cellData.hasHolidayBooked
                          ? FILTER_COLORS.holidays.dark.text
                          : showHoliday
                            ? FILTER_COLORS.holidays.dark.text
                            : showPTO
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
                  {renderCellIconLabel({
                    showHoliday,
                    ptoData,
                    params,
                    showLabel: density === 'comfortable',
                    isFirstVisibleDayOfPTO: !!isFirstVisibleDayOfPTO,
                    showPTO,
                    isFirstDayOfSick: !!isFirstDayOfSick,
                    showSick,
                    isBirthday: !!isBirthday,
                    cellData,
                  })}
                </Box>
              </Tooltip>
            );
          },
        };
      }),
    ],
    [daysToShow, holidays, ptoData, activeFilters, density, theme.palette.mode],
  );

  return (
    <CalendarContext.Provider value={calendarState}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          ...theme.applyStyles('dark', {
            backgroundColor: '#141A1F',
          }),
        }}
      >
        <DataGridPremium
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
          columnHeaderHeight={50}
          rowHeight={50}
          slots={{ toolbar: CalendarToolbar }}
          getCellClassName={(params) =>
            params.field === format(new Date(), 'yyyy-MM-dd') ? 'today' : ''
          }
          showToolbar
          hideFooter
          showCellVerticalBorder
          disableColumnMenu
          disableColumnSorting
          disableColumnReorder
          disableRowSelectionOnClick
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
            text: {
              primary: '#38363f',
              secondary: '#76747f',
            },
            divider: '#EEEBF0',
            action: {
              hover: '#6550b9',
            },
            DataGrid: {
              bg: '#fff',
              pinnedBg: '#fff',
              headerBg: '#fdfcfe',
            },
          },
        },
        dark: {
          palette: {
            text: {
              primary: '#faf8ff',
              secondary: '#d0cdd7',
            },
            divider: '#38363E',
            action: {
              hover: '#558bbc',
            },
            DataGrid: {
              bg: '#141A1F',
              pinnedBg: '#141A1F',
              headerBg: '#1e2429',
            },
          },
        },
      },
      shape: {
        borderRadius: 10,
      },
      components: {
        MuiButtonBase: {
          defaultProps: {
            disableRipple: true,
            disableTouchRipple: true,
          },
          styleOverrides: {
            root: ({ theme }) => ({
              '&:hover': {
                backgroundColor: '#faf8ff',
                ...theme.applyStyles('dark', {
                  backgroundColor: '#252d34',
                }),
              },
              '&:focus-visible': {
                outline: '2px solid #3E63DD',
                outlineOffset: '-1px',
              },
            }),
          },
        },
        MuiToggleButtonGroup: {
          styleOverrides: {
            root: ({ theme }) => ({
              display: 'flex',
              gap: '1px',
              background: '#faf8ff',
              ...theme.applyStyles('dark', {
                background: '#1e2933',
              }),
            }),
          },
        },
        MuiToggleButton: {
          styleOverrides: {
            root: ({ theme }) => ({
              textTransform: 'none',
              letterSpacing: '0.01em',
              padding: '6px 12px',
              borderRadius: '10px !important',
              borderColor: 'transparent',
              margin: '0 !important',
              color: '#76747f',
              ...theme.applyStyles('dark', {
                color: '#bcbac7',
              }),
              '&.Mui-selected': {
                background: '#fff',
                borderColor: 'rgba(46, 43, 48, 0.1)',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                ...theme.applyStyles('dark', {
                  background: '#1d2329',
                  borderColor: '#38363e',
                  color: '#f2eff3',
                }),
                '&:hover': {
                  background: '#fff',
                  ...theme.applyStyles('dark', {
                    background: '#1d2329',
                  }),
                },
              },
            }),
          },
        },
        MuiButton: {
          styleOverrides: {
            root: ({ theme }) => ({
              padding: '0 12px',
              background: '#fff',
              borderColor: 'rgba(46, 43, 48, 0.1)',
              boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
              borderRadius: '10px',
              whiteSpace: 'nowrap',
              textTransform: 'none',
              color: '#38363f',
              letterSpacing: '0.01em',
              ...theme.applyStyles('dark', {
                color: '#f2eff3',
                background: '#1d2329',
                borderColor: '#38363e',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
              }),
            }),
          },
        },
        MuiIconButton: {
          styleOverrides: {
            root: ({ theme }) => ({
              color: '#38363f',
              '&:hover': {
                backgroundColor: '#faf8ff',
              },
              ...theme.applyStyles('dark', {
                color: '#e3dfe6',
              }),
            }),
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              borderRadius: '10px',
              fontSize: '0.875rem',
              height: 36,
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#3E63DD',
              },
            },
            notchedOutline: {
              borderColor: '#EEEBF0',
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              borderRadius: '10px',
            },
            label: {
              fontWeight: '500',
            },
          },
        },
        MuiTooltip: {
          defaultProps: {
            slotProps: {
              popper: {
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [0, -8],
                    },
                  },
                ],
              },
            },
          },
          styleOverrides: {
            tooltip: ({ theme }) => ({
              color: '#38363f',
              backgroundColor: '#fff',
              borderRadius: '8px',
              border: '1px solid rgba(46, 43, 48, 0.1)',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.1)',
              fontSize: '0.75rem',
              padding: '4px 8px',
              ...theme.applyStyles('dark', {
                color: '#f2eff3',
                backgroundColor: '#1d2329',
                border: '1px solid #38363e',
              }),
            }),
          },
        },
        MuiDataGrid: {
          styleOverrides: {
            root: ({ theme }) => ({
              borderColor: '#EEEBF0',
              '--DataGrid-rowBorderColor': '#EEEBF0',
              ...theme.applyStyles('dark', {
                borderColor: '#38363E',
                '--DataGrid-rowBorderColor': '#38363E',
              }),
            }),
            // scrollbar: {
            //   scrollbarWidth: 'thin',
            // },
            cell: ({ theme }) => ({
              padding: 0,
              '&.today': {
                backgroundColor: '#faf8ff',
                ...theme.applyStyles('dark', {
                  backgroundColor: '#1e2933',
                }),
              },
              '&:focus': {
                outline: 'none',
              },
              '&:focus-within': {
                outline: 'none',
              },
            }),
            'cell--pinnedLeft': {
              display: 'flex',
              alignItems: 'center',
              padding: '0 16px',
              color: '#09090b',
              borderTopColor: 'transparent',
            },
            // row: ({ theme }) => ({
            //   '&:hover': {
            //     backgroundColor: '#f7f9ff',
            //     ...theme.applyStyles('dark', {
            //       backgroundColor: '#1e2933',
            //     }),
            //   },
            // }),
            columnSeparator: {
              display: 'none',
            },
            columnHeader: {
              '&:focus': {
                outline: 'none',
              },
              '&:focus-within': {
                outline: 'none',
              },
            },
            'columnHeader--pinnedLeft': {
              padding: '0 16px',
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
