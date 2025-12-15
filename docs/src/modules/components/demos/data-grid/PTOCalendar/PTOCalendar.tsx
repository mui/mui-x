import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import {
  DataGridPremium,
  GridColDef,
  GridRenderCellParams,
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
import { findContinuousPeriods, isCurrentDay, isEmployeeOutToday } from './utils/dateUtils';
import type { HolidayData, PTOData } from './types/pto';
import { CalendarContext } from './CalendarContext';
import { CalendarToolbar } from './CalendarToolbar';
import { FILTER_COLORS } from './constants';
import { ptoCalendarTheme } from './theme';
import { DemoContainer } from '../DemoContainer';
import { samplePTOData } from './data/sampleData';

type RowDataEntry = PTOData[string];

type DateTemplate = `${string}-${string}-${string}`;

interface RowData extends RowDataEntry {
  id: number | string;
  employee: string;
  [key: DateTemplate]: {
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
  daysToShow: Array<{ date: Date; dateStr: DateTemplate }>,
  activeFilters: string[],
  isFirstDayOfPTO: boolean,
): boolean {
  if (!params.value?.hasPTO) {
    return false;
  }
  if (isFirstDayOfPTO) {
    return true;
  }
  const prevDayIndex = daysToShow.findIndex(({ dateStr }) => dateStr === params.field) - 1;
  if (prevDayIndex >= 0) {
    const prevDayStr = daysToShow[prevDayIndex].dateStr;
    const prevCell = params.row[prevDayStr];
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
  isBirthday: boolean;
}
function getCellTooltipTitle({
  showHoliday,
  hasHolidayBooked,
  holidayName,
  showPTO,
  currentPTOPeriod,
  showSick,
  currentSickPeriod,
  isBirthday,
}: TooltipTitleParams): string {
  if (showHoliday && hasHolidayBooked) {
    return `${holidayName} (booked as PTO)`;
  }
  if (showHoliday) {
    return `${holidayName}`;
  }
  if (showPTO) {
    return `Vacation (${currentPTOPeriod?.length} day${currentPTOPeriod?.length === 1 ? '' : 's'})`;
  }
  if (showSick) {
    return `Sick leave (${currentSickPeriod?.length} day${currentSickPeriod?.length === 1 ? '' : 's'})`;
  }
  if (isBirthday) {
    return `Birthday`;
  }
  return '';
}

interface RenderCellIconLabelParams {
  showHoliday: boolean;
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
  params,
  isFirstVisibleDayOfPTO,
  showPTO,
  isFirstDayOfSick,
  showLabel,
  showSick,
  isBirthday,
}: RenderCellIconLabelParams) {
  if (showHoliday) {
    return (
      <React.Fragment>
        <Box
          component="img"
          src={`https://flagcdn.com/w40/${params.row.nationality.toLowerCase()}.png`}
          alt={`${params.row.nationality} flag`}
          sx={{
            width: 18,
            height: 18,
            margin: '1px',
            borderRadius: '50%',
          }}
        />
        {showLabel && 'Holiday'}
      </React.Fragment>
    );
  }
  if (isFirstVisibleDayOfPTO && showPTO) {
    return (
      <React.Fragment>
        <BeachAccessOutlined fontSize="small" />
        {showLabel && 'Vacation'}
      </React.Fragment>
    );
  }
  if (isFirstDayOfSick && showSick) {
    return (
      <React.Fragment>
        <DeviceThermostatOutlined fontSize="small" />
        {showLabel && 'Sick leave'}
      </React.Fragment>
    );
  }
  if (isBirthday) {
    return (
      <React.Fragment>
        <Cake fontSize="small" />
        {showLabel && 'Birthday'}
      </React.Fragment>
    );
  }
  return null;
}

function getCellStyles(
  showHoliday: boolean,
  isBirthday: boolean,
  showPTO: boolean,
  showSick: boolean,
  isCurrent: boolean,
  cellData: CellData,
  isDark: boolean,
): React.CSSProperties {
  if (showHoliday && cellData.hasHolidayBooked) {
    if (isDark) {
      return FILTER_COLORS.holidays.dark;
    }
    return {
      ...FILTER_COLORS.holidays.light,
      borderWidth: '1px',
      borderStyle: 'solid',
    };
  }
  if (showHoliday || isBirthday) {
    if (isDark) {
      return {
        ...FILTER_COLORS.holidays.dark,
        backgroundColor: 'transparent',
      };
    }
    return {
      ...FILTER_COLORS.holidays.light,
      backgroundColor: 'transparent',
      borderWidth: '1px',
      borderStyle: 'dashed',
    };
  }
  if (showPTO) {
    if (isDark) {
      return FILTER_COLORS.vacation.dark;
    }
    return {
      ...FILTER_COLORS.vacation.light,
      borderWidth: '1px',
      borderStyle: 'solid',
    };
  }
  if (showSick) {
    if (isDark) {
      return FILTER_COLORS.sick.dark;
    }
    return {
      ...FILTER_COLORS.sick.light,
      borderWidth: '1px',
      borderStyle: 'solid',
    };
  }
  if (isCurrent) {
    if (isDark) {
      return {
        backgroundColor: '#1e2429',
      };
    }
    return {
      backgroundColor: '#faf9fb',
      borderColor: 'transparent',
    };
  }
  return {
    backgroundColor: 'transparent',
    color: 'transparent',
    border: 'none',
  };
}

function getCellType(
  hasHoliday: boolean,
  hasPTO: boolean,
  hasSick: boolean,
  holidaysVisible: boolean,
): string {
  if (hasHoliday && holidaysVisible) {
    return 'holidays';
  }
  if (hasPTO) {
    return 'vacation';
  }
  if (hasSick) {
    return 'sick';
  }
  return '';
}

function PTOCalendar() {
  const calendarState = useCalendarState();
  const { currentDate, activeFilters, density, showPresentToday } = calendarState;

  const [holidays, setHolidays] = React.useState<HolidayData>({});

  const monthStart = React.useMemo(() => startOfMonth(currentDate), [currentDate]);
  const monthEnd = React.useMemo(() => endOfMonth(currentDate), [currentDate]);
  const daysToShow = React.useMemo(() => {
    const interval = eachDayOfInterval({ start: monthStart, end: monthEnd });
    return interval.map((d) => ({
      date: d,
      dateStr: format(d, 'yyyy-MM-dd') as DateTemplate,
    }));
  }, [monthStart, monthEnd]);

  React.useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const year = currentDate.getFullYear();
        const countries = Array.from(
          new Set(Object.values(samplePTOData).map((data) => data.nationality)),
        );
        const holidayData = await getHolidaysForCountries(year, countries);
        setHolidays(holidayData);
      } catch (error) {
        console.error('Failed to fetch holidays:', error);
        // TODO: Add proper error handling UI
      }
    };

    fetchHolidays();
  }, [currentDate]);

  const { rows, pinnedRows } = React.useMemo(() => {
    const rowData: RowData[] = [];

    const topPinnedRow: { id: string; employee: string; [key: string]: string | number } = {
      id: 'summary',
      employee: 'Out of office:',
    };

    const ptoDatesAsSets: Array<
      RowDataEntry & {
        employee: string;
        ptoDatesSet: Set<string>;
        sickDatesSet: Set<string>;
      }
    > = [];

    // eslint-disable-next-line guard-for-in
    for (const key in samplePTOData) {
      const data = samplePTOData[key];

      // Add filter to hide out employees out in current day
      if (showPresentToday) {
        const isOutToday = isEmployeeOutToday(
          data.ptoDates,
          data.sickDates,
          holidays[data.nationality] || {},
        );
        if (isOutToday) {
          continue;
        }
      }

      ptoDatesAsSets.push({
        employee: key,
        ...data,
        // Use Set for faster search, since we're iterating over each employee's dates for each day
        ptoDatesSet: new Set(data.ptoDates),
        sickDatesSet: new Set(data.sickDates),
      });
    }

    daysToShow.forEach(({ dateStr }) => {
      let count = 0;
      ptoDatesAsSets.forEach((data, index) => {
        if (typeof rowData[index] === 'undefined') {
          rowData[index] = {
            id: index + 1,
            employee: data.employee,
            team: data.team,
            nationality: data.nationality,
            birthday: data.birthday,
            avatar: data.avatar,
            ptoDates: data.ptoDates,
            sickDates: data.sickDates,
          };
        }
        const row = rowData[index];

        const hasPTO = data.ptoDatesSet.has(dateStr);
        const hasSick = data.sickDatesSet.has(dateStr);
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

        if (hasPTO || hasSick) {
          count += 1;
        }
      });
      topPinnedRow[dateStr] = count;
    });

    return { rows: rowData, pinnedRows: { top: [topPinnedRow] } };
  }, [activeFilters, daysToShow, holidays, showPresentToday]);

  const columns = React.useMemo<GridColDef[]>(() => {
    const vacationVisible = activeFilters.includes('vacation');
    const sickVisible = activeFilters.includes('sick');
    const holidaysVisible = activeFilters.includes('holidays');

    return [
      {
        field: 'employee',
        headerName: 'Employees',
        width: 180,
        renderHeader: EmployeeHeader,
        renderCell: (params: GridRenderCellParams<RowData>) => {
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
                ml: -0.25,
              }}
            >
              <Avatar
                src={`/static/x/data-grid/demos/${params.row.avatar}.png`}
                sx={{
                  flexShrink: 0,
                  width: 32,
                  height: 32,
                  backgroundColor: '#e1d7fb',
                  fontSize: '0.75rem',
                  fontWeight: 'medium',
                  color: '#1f1f20',
                }}
              >
                {initials}
              </Avatar>
              <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
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
                  {params.row.team}
                </Typography>
              </Box>
            </Box>
          );
        },
      },
      ...daysToShow.map(({ dateStr, date: day }) => {
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
            if (row.id === 'summary' || column.field === 'employee') {
              return 1;
            }
            if (!value.show) {
              return 1;
            }
            if ((!vacationVisible && !sickVisible) || (!value.hasPTO && !value.hasSick)) {
              // We only span vacation and sick days
              return 1;
            }
            const colIndex = daysToShow.findIndex((date) => date.dateStr === column.field);
            const currentCellType = getCellType(
              value.hasHoliday,
              value.hasPTO,
              value.hasSick,
              holidaysVisible,
            );

            let span = 1;
            for (let i = colIndex + 1; i < daysToShow.length; i += 1) {
              const nextCell = row[daysToShow[i].dateStr];
              if (!nextCell?.show || (nextCell.hasHoliday && holidaysVisible)) {
                break;
              }

              const nextCellType = getCellType(
                nextCell.hasHoliday,
                nextCell.hasPTO,
                nextCell.hasSick,
                holidaysVisible,
              );
              if (nextCellType !== currentCellType) {
                break;
              }

              span += 1;
            }
            return span;
          },
          renderCell: (params: GridRenderCellParams) => {
            if (params.row.id === 'summary') {
              const count = params.value;
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

            if (!cellData.show && isCurrent) {
              return null;
            }

            const ptoPeriods = findContinuousPeriods(params.row.ptoDates || []);
            const sickPeriods = findContinuousPeriods(params.row.sickDates || []);
            const currentPTOPeriod = ptoPeriods.find((period) => period.includes(params.field));
            const currentSickPeriod = sickPeriods.find((period) => period.includes(params.field));
            const isFirstDayOfPTO = currentPTOPeriod && currentPTOPeriod[0] === params.field;
            const isFirstDayOfSick = currentSickPeriod && currentSickPeriod[0] === params.field;
            const isMiddleOfPeriod = !isFirstDayOfPTO && !isFirstDayOfSick;
            const lastDayOfPeriod = daysToShow[daysToShow.length - 1].date;
            const isEndOfPTOPeriodInRange =
              currentPTOPeriod &&
              startOfDay(new Date(currentPTOPeriod[currentPTOPeriod.length - 1])) <=
                startOfDay(lastDayOfPeriod);
            const isEndOfSickPeriodInRange =
              currentSickPeriod &&
              startOfDay(new Date(currentSickPeriod[currentSickPeriod.length - 1])) <=
                startOfDay(lastDayOfPeriod);
            const isEndOfPeriodInRange = isEndOfPTOPeriodInRange || isEndOfSickPeriodInRange;
            const showPTO = cellData.hasPTO && vacationVisible;
            const showSick = cellData.hasSick && sickVisible;
            const showHoliday = cellData.hasHoliday && holidaysVisible;

            const holidayName = showHoliday ? holidays[params.row.nationality][params.field] : '';
            const isBirthday = format(day, 'MM-dd') === params.row.birthday;

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
              isBirthday,
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
                  sx={(theme) => ({
                    width: '100%',
                    userSelect: 'none',
                    height: '40px',
                    marginLeft:
                      !isMiddleOfPeriod || showHoliday || isBirthday || isFirstVisibleDayOfPTO
                        ? 0.5
                        : 0,
                    marginRight: isEndOfPeriodInRange || showHoliday || isBirthday ? 0.5 : 0,
                    borderTopLeftRadius:
                      !isMiddleOfPeriod || showHoliday || isBirthday || isFirstVisibleDayOfPTO
                        ? '12px'
                        : 0,
                    borderBottomLeftRadius:
                      !isMiddleOfPeriod || showHoliday || isBirthday || isFirstVisibleDayOfPTO
                        ? '12px'
                        : 0,
                    borderTopRightRadius:
                      isEndOfPeriodInRange || showHoliday || isBirthday ? '12px' : '0',
                    borderBottomRightRadius:
                      isEndOfPeriodInRange || showHoliday || isBirthday ? '12px' : '0',
                    ...getCellStyles(
                      showHoliday,
                      isBirthday,
                      showPTO,
                      showSick,
                      isCurrent,
                      cellData,
                      false,
                    ),
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
                    alignSelf: 'center',
                    ...theme.applyStyles('dark', {
                      ...getCellStyles(
                        showHoliday,
                        isBirthday,
                        showPTO,
                        showSick,
                        isCurrent,
                        cellData,
                        true,
                      ),
                    }),
                  })}
                >
                  {renderCellIconLabel({
                    showHoliday,
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
    ];
  }, [daysToShow, holidays, activeFilters, density]);

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  return (
    <DemoContainer
      theme={ptoCalendarTheme}
      href="https://github.com/mui/mui-x/tree/master/docs/src/modules/components/demos/data-grid/PTOCalendar"
    >
      <CalendarContext.Provider value={calendarState}>
        <Box
          sx={(theme) => ({
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            ...theme.applyStyles('dark', {
              backgroundColor: '#141A1F',
            }),
          })}
        >
          <DataGridPremium
            pinnedRows={pinnedRows}
            rows={rows}
            columns={columns}
            pinnedColumns={{
              left: ['employee'],
            }}
            columnHeaderHeight={50}
            rowHeight={50}
            slots={{ toolbar: CalendarToolbar }}
            getCellClassName={(params) => (params.field === todayStr ? 'today' : '')}
            hideFooter
            showToolbar
            showCellVerticalBorder
            disableColumnMenu
            disableColumnSorting
            disableColumnReorder
            disableRowSelectionOnClick
          />
        </Box>
      </CalendarContext.Provider>
    </DemoContainer>
  );
}

export default PTOCalendar;
