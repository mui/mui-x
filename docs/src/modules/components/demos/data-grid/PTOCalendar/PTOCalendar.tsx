import * as React from 'react';
import { useTheme } from '@mui/material/styles';
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
import { findContinuousPeriods, isCurrentDay } from './utils/dateUtils';
import { HolidayData } from './types/pto';
import { CalendarContext } from './CalendarContext';
import { CalendarToolbar } from './CalendarToolbar';
import { FILTER_COLORS } from './constants';
import { ptoCalendarTheme } from './theme';
import { DemoContainer } from '../DemoContainer';
import { samplePTOData } from './data/sampleData';

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
  if (!params.value?.hasPTO) {
    return false;
  }
  if (isFirstDayOfPTO) {
    return true;
  }
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
      <React.Fragment>
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

function PTOCalendar() {
  const theme = useTheme();
  const calendarState = useCalendarState();
  const { currentDate, activeFilters, density } = calendarState;

  const [holidays, setHolidays] = React.useState<HolidayData>({});
  const ptoData = samplePTOData;

  const monthStart = React.useMemo(() => startOfMonth(currentDate), [currentDate]);
  const monthEnd = React.useMemo(() => endOfMonth(currentDate), [currentDate]);
  const daysToShow = React.useMemo(
    () => eachDayOfInterval({ start: monthStart, end: monthEnd }),
    [monthStart, monthEnd],
  );

  React.useEffect(() => {
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

  const { rows, pinnedRows } = React.useMemo(() => {
    const rowData: RowData[] = [];

    const topPinnedRow: { id: string; employee: string; [key: string]: string | number } = {
      id: 'summary',
      employee: 'Out of office:',
    };

    const ptoDatesAsSets: {
      employee: string;
      nationality: string;
      ptoDates: Set<string>;
      sickDates: Set<string>;
    }[] = [];

    // eslint-disable-next-line guard-for-in
    for (const key in ptoData) {
      const data = ptoData[key];
      ptoDatesAsSets.push({
        employee: key,
        nationality: data.nationality,
        // Use Set for faster search, since we're iterating over each employee's dates for each day
        ptoDates: new Set(data.ptoDates),
        sickDates: new Set(data.sickDates),
      });
    }

    daysToShow.forEach((day) => {
      const dateStr = format(day, 'yyyy-MM-dd');
      let count = 0;
      ptoDatesAsSets.forEach((data, index) => {
        if (typeof rowData[index] === 'undefined') {
          rowData[index] = { id: index + 1, employee: data.employee };
        }
        const row = rowData[index];

        const hasPTO = data.ptoDates.has(dateStr);
        const hasSick = data.sickDates.has(dateStr);
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
  }, [activeFilters, daysToShow, holidays, ptoData]);

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: 'employee',
        headerName: 'Employees',
        width: 180,
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
                ml: -0.25,
              }}
            >
              <Avatar
                src={`/static/x/data-grid/demos/${ptoData[params.value].avatar}.png`}
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
            if (row.id === 'summary') {
              return 1;
            }
            if (!value.show) {
              return 1;
            }

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
              if (!nextCell?.show || (nextCell.hasHoliday && activeFilters.includes('holidays'))) {
                break;
              }

              const nextCellType =
                nextCell.hasHoliday && activeFilters.includes('holidays')
                  ? 'holidays'
                  : nextCell.hasPTO
                    ? 'vacation'
                    : nextCell.hasSick
                      ? 'sick'
                      : '';
              if (nextCellType !== currentCellType) {
                break;
              }

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
                  sx={{
                    width: '100%',
                    userSelect: 'none',
                    height: showPTO || showSick || showHoliday || isBirthday ? '40px' : '100%',
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
                    backgroundColor:
                      showHoliday && cellData.hasHolidayBooked
                        ? FILTER_COLORS.holidays.background
                        : showHoliday || isBirthday
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
                        : showHoliday || isBirthday
                          ? FILTER_COLORS.holidays.text
                          : showPTO
                            ? FILTER_COLORS.vacation.text
                            : showSick
                              ? FILTER_COLORS.sick.text
                              : 'transparent',
                    border:
                      showHoliday && cellData.hasHolidayBooked
                        ? `1px solid ${FILTER_COLORS.holidays.border}`
                        : showHoliday || isBirthday
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
                          : showHoliday || isBirthday
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
                          : showHoliday || isBirthday
                            ? FILTER_COLORS.holidays.dark.border
                            : showPTO
                              ? FILTER_COLORS.vacation.dark.border
                              : showSick
                                ? FILTER_COLORS.sick.dark.border
                                : 'transparent',
                      color:
                        showHoliday && cellData.hasHolidayBooked
                          ? FILTER_COLORS.holidays.dark.text
                          : showHoliday || isBirthday
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
    <DemoContainer theme={ptoCalendarTheme}>
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
            pinnedRows={pinnedRows}
            rows={rows}
            columns={columns}
            pinnedColumns={{
              left: ['employee'],
            }}
            columnHeaderHeight={50}
            rowHeight={50}
            slots={{ toolbar: CalendarToolbar }}
            getCellClassName={(params) =>
              params.field === format(new Date(), 'yyyy-MM-dd') ? 'today' : ''
            }
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
