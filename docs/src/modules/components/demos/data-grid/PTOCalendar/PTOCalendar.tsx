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
import Sick from '@mui/icons-material/LocalHospital';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfDay } from 'date-fns';
import { getHolidaysForCountries } from './data/holidays';
import { useCalendarState } from './hooks/useCalendarState';
import { usePTOData } from './hooks/usePTOData';
import { findContinuousPeriods, isCurrentDay } from './utils/dateUtils';
import { HolidayData } from './types/pto';
import { CalendarContext } from './CalendarContext';
import { CalendarToolbar } from './CalendarToolbar';
import { FILTER_COLORS } from './constants';
import type {} from '@mui/x-data-grid/themeAugmentation';

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
    <Typography fontWeight="bold" fontSize="0.75rem">
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

interface CellSxParams {
  showHoliday: boolean;
  hasHolidayBooked: boolean;
  showPTO: boolean;
  showSick: boolean;
  isCurrent: boolean;
  isMiddleOfPeriod: boolean;
  isEndOfPeriodInRange: boolean;
  isFirstVisibleDayOfPTO: boolean;
  theme: any;
}
function getCellSx({
  showHoliday,
  hasHolidayBooked,
  showPTO,
  showSick,
  isCurrent,
  isMiddleOfPeriod,
  isEndOfPeriodInRange,
  isFirstVisibleDayOfPTO,
  theme,
}: CellSxParams) {
  return {
    width: '100%',
    height: showPTO || showSick || showHoliday ? '40px' : '100%',
    marginLeft: !isMiddleOfPeriod || showHoliday || isFirstVisibleDayOfPTO ? 0.5 : 0,
    marginRight: isEndOfPeriodInRange || showHoliday ? 0.5 : 0,
    borderTopLeftRadius: !isMiddleOfPeriod || showHoliday || isFirstVisibleDayOfPTO ? '12px' : 0,
    borderBottomLeftRadius: !isMiddleOfPeriod || showHoliday || isFirstVisibleDayOfPTO ? '12px' : 0,
    borderTopRightRadius: isEndOfPeriodInRange || showHoliday ? '12px' : '0',
    borderBottomRightRadius: isEndOfPeriodInRange || showHoliday ? '12px' : '0',
    backgroundColor:
      showHoliday && hasHolidayBooked
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
    justifyContent: 'start',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    px: 1.5,
    fontSize: '0.75rem',
    fontWeight: 'medium',
    gap: 0.75,
    color:
      showHoliday && hasHolidayBooked
        ? FILTER_COLORS.holidays.text
        : showHoliday
          ? FILTER_COLORS.holidays.text
          : showPTO
            ? FILTER_COLORS.vacation.text
            : showSick
              ? FILTER_COLORS.sick.text
              : 'transparent',
    border:
      showHoliday && hasHolidayBooked
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
        showHoliday && hasHolidayBooked
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
        showHoliday && hasHolidayBooked
          ? FILTER_COLORS.holidays.dark.border
          : showHoliday
            ? FILTER_COLORS.holidays.dark.border
            : showPTO
              ? FILTER_COLORS.vacation.dark.border
              : showSick
                ? FILTER_COLORS.sick.dark.border
                : 'transparent',
      color:
        showHoliday && hasHolidayBooked
          ? FILTER_COLORS.holidays.dark.text
          : showHoliday
            ? FILTER_COLORS.holidays.dark.text
            : showPTO
              ? FILTER_COLORS.vacation.dark.text
              : showSick
                ? FILTER_COLORS.sick.dark.text
                : 'transparent',
      '&:hover': {
        backgroundColor: showPTO || showSick ? 'none' : isCurrent ? 'transparent' : '#1e2429',
      },
    }),
  };
}

interface RenderCellIconLabelParams {
  showHoliday: boolean;
  hasHolidayBooked: boolean;
  ptoData: any;
  params: PTOParams;
  theme: any;
  isFirstVisibleDayOfPTO: boolean;
  showPTO: boolean;
  isFirstDayOfSick: boolean;
  showSick: boolean;
  isBirthday: boolean;
  cellData: CellData;
}
function renderCellIconLabel({
  showHoliday,
  hasHolidayBooked,
  ptoData,
  params,
  theme,
  isFirstVisibleDayOfPTO,
  showPTO,
  isFirstDayOfSick,
  showSick,
  isBirthday,
  cellData,
}: RenderCellIconLabelParams) {
  if (showHoliday) {
    return (
      <>
        <Box
          component="img"
          src={`https://flagcdn.com/w20/${ptoData[params.row.employee].nationality.toLowerCase()}.png`}
          alt={`${ptoData[params.row.employee].nationality} flag`}
          sx={{
            width: 18,
            height: 18,
            opacity: 0.9,
            borderRadius: '50%',
            border: `2px solid ${FILTER_COLORS.holidays.border}`,
            ...theme.applyStyles('dark', {
              border: `2px solid text.primary`,
            }),
          }}
        />
        Holiday
      </>
    );
  }
  if (isFirstVisibleDayOfPTO && showPTO) {
    return (
      <>
        <BeachAccess
          sx={{
            fontSize: '1rem',
            color: FILTER_COLORS.vacation.text,
            ...theme.applyStyles('dark', {
              color: FILTER_COLORS.vacation.dark.text,
            }),
          }}
        />
        Vacation
      </>
    );
  }
  if (isFirstDayOfSick && showSick) {
    return (
      <>
        <Sick
          sx={{
            fontSize: '1rem',
            color: FILTER_COLORS.sick.text,
            ...theme.applyStyles('dark', {
              color: FILTER_COLORS.sick.dark.text,
            }),
          }}
        />
        Sick leave
      </>
    );
  }
  if (isBirthday && cellData.show) {
    return (
      <>
        <Cake sx={{ fontSize: '1rem', color: '#75758d' }} />
        Birthday
      </>
    );
  }
  return null;
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
          width: 110,
          type: 'boolean' as const,
          renderHeader: () => (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5,
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
                  color: isCurrent ? '#3E63DD' : 'text.secondary',
                  fontSize: '0.75rem',
                  lineHeight: 1,
                }}
              >
                {format(day, 'd')}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: isCurrent ? '#3E63DD' : 'text.secondary',
                  fontWeight: isCurrent ? 'bold' : 'medium',
                  fontSize: '0.7rem',
                  lineHeight: 1,
                }}
              >
                {format(day, 'EEE')}
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
              <Tooltip title={title}>
                <Box
                  sx={getCellSx({
                    showHoliday,
                    hasHolidayBooked: !!cellData.hasHolidayBooked,
                    showPTO,
                    showSick,
                    isCurrent: isCurrentDay(day),
                    isMiddleOfPeriod: !!isMiddleOfPeriod,
                    isEndOfPeriodInRange: !!isEndOfPeriodInRange,
                    isFirstVisibleDayOfPTO: !!isFirstVisibleDayOfPTO,
                    theme,
                  })}
                >
                  {renderCellIconLabel({
                    showHoliday,
                    hasHolidayBooked: !!cellData.hasHolidayBooked,
                    ptoData,
                    params,
                    theme,
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
    [daysToShow, holidays, ptoData, activeFilters],
  );

  return (
    <CalendarContext.Provider value={calendarState}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: 800,
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
          columnHeaderHeight={40}
          slots={{ toolbar: CalendarToolbar }}
          getRowHeight={(params) => (params.model.id === 'summary' ? 40 : 50)}
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
      shape: {
        borderRadius: 10,
      },
      components: {
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
            cell: ({ theme }) => ({
              padding: 0,
              '&.today': {
                backgroundColor: '#f7f9ff',
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
            row: ({ theme }) => ({
              '&:hover': {
                backgroundColor: '#f7f9ff',
                ...theme.applyStyles('dark', {
                  backgroundColor: '#1e2933',
                }),
              },
            }),
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
            columnHeaderTitleContainer: {
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              color: '#75758d',
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
