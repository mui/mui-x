import { createSourceFiles } from '../utils/sourceFileImporter';

export const ptoCalendarSourceFiles = createSourceFiles({
  'PTOCalendar.tsx': {
    content: `import * as React from 'react';
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
import { ptoCalendarSourceFiles } from './sourceFiles';

type RowDataEntry = PTOData[string];

type DateTemplate = \`\${string}-\${string}-\${string}\`;

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
    return \`\${holidayName} (booked as PTO)\`;
  }
  if (showHoliday) {
    return \`\${holidayName}\`;
  }
  if (showPTO) {
    return \`Vacation (\${currentPTOPeriod?.length} day\${currentPTOPeriod?.length === 1 ? '' : 's'})\`;
  }
  if (showSick) {
    return \`Sick leave (\${currentSickPeriod?.length} day\${currentSickPeriod?.length === 1 ? '' : 's'})\`;
  }
  if (isBirthday) {
    return \`Birthday\`;
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
          src={\`https://flagcdn.com/w40/\${params.row.nationality.toLowerCase()}.png\`}
          alt={\`\${params.row.nationality} flag\`}
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
                src={\`/static/x/data-grid/demos/\${params.row.avatar}.png\`}
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
      demoSourceFiles={ptoCalendarSourceFiles}
      sourceDisplayConfig={{
        defaultCategory: 'main',
      }}
      defaultFile="PTOCalendar.tsx"
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

export default PTOCalendar;`,
    category: 'main',
    priority: 1,
  },

  'CalendarToolbar.tsx': {
    content: `import * as React from 'react';
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

export { CalendarToolbar };`,
    category: 'components',
    priority: 1,
  },

  'CalendarSearch.tsx': {
    content: `import * as React from 'react';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import {
  QuickFilter,
  QuickFilterClear,
  QuickFilterControl,
  QuickFilterTrigger,
  ToolbarButton,
} from '@mui/x-data-grid-premium';
import InputAdornment from '@mui/material/InputAdornment';
import { styled } from '@mui/material/styles';

type OwnerState = {
  expanded: boolean;
};

const StyledQuickFilter = styled(QuickFilter)({
  display: 'grid',
  alignItems: 'center',
  marginLeft: 'auto',
});

const StyledToolbarButton = styled(ToolbarButton)<{ ownerState: OwnerState }>(
  ({ theme, ownerState }) => ({
    gridArea: '1 / 1',
    width: 'min-content',
    height: 'min-content',
    zIndex: 1,
    opacity: ownerState.expanded ? 0 : 1,
    pointerEvents: ownerState.expanded ? 'none' : 'auto',
    transition: theme.transitions.create(['opacity']),
  }),
);

const StyledTextField = styled(TextField)<{
  ownerState: OwnerState;
}>(({ theme, ownerState }) => ({
  gridArea: '1 / 1',
  overflowX: 'clip',
  width: ownerState.expanded ? 200 : 'var(--trigger-width)',
  opacity: ownerState.expanded ? 1 : 0,
  transition: theme.transitions.create(['width', 'opacity']),
}));

function CalendarSearch() {
  return (
    <StyledQuickFilter>
      <QuickFilterTrigger
        render={(triggerProps, state) => (
          <Tooltip title="Search" enterDelay={0}>
            <StyledToolbarButton
              {...triggerProps}
              ownerState={{ expanded: state.expanded }}
              color="default"
              aria-disabled={state.expanded}
            >
              <SearchIcon fontSize="small" />
            </StyledToolbarButton>
          </Tooltip>
        )}
      />
      <QuickFilterControl
        render={({ ref, ...controlProps }, state) => (
          <StyledTextField
            {...controlProps}
            ownerState={{ expanded: state.expanded }}
            inputRef={ref}
            aria-label="Search"
            placeholder="Search..."
            size="small"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: state.value ? (
                  <InputAdornment position="end">
                    <QuickFilterClear
                      edge="end"
                      size="small"
                      aria-label="Clear search"
                      material={{ sx: { marginRight: -0.75 } }}
                    >
                      <CancelIcon fontSize="small" />
                    </QuickFilterClear>
                  </InputAdornment>
                ) : null,
                ...controlProps.slotProps?.input,
              },
              ...controlProps.slotProps,
            }}
          />
        )}
      />
    </StyledQuickFilter>
  );
}

export { CalendarSearch };
`,
    category: 'components',
    priority: 3,
  },

  'CalendarFilters.tsx': {
    content: `import * as React from 'react';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import { ToolbarButton } from '@mui/x-data-grid-premium';
import Chip from '@mui/material/Chip';
import Check from '@mui/icons-material/Check';
import { FilterType } from './types/pto';
import { FILTER_OPTIONS, FILTER_LABELS, FILTER_COLORS } from './constants';

interface CalendarFiltersProps {
  activeFilters: FilterType[];
  showPresentToday: boolean;
  onFilterRemove: (filter: FilterType) => void;
  onFilterAdd: (filter: FilterType) => void;
  onTogglePresentToday: () => void;
}

export function CalendarFilters({
  activeFilters,
  showPresentToday,
  onFilterRemove,
  onFilterAdd,
  onTogglePresentToday,
}: CalendarFiltersProps) {
  return (
    <Stack direction="row" alignItems="center" gap={2}>
      <Stack direction="row" alignItems="center" gap={1}>
        {FILTER_OPTIONS.map((filter) => {
          const isActive = activeFilters.includes(filter);
          return (
            <ToolbarButton
              key={filter}
              onClick={!isActive ? () => onFilterAdd(filter) : () => onFilterRemove(filter)}
              render={
                <Chip
                  label={FILTER_LABELS[filter]}
                  icon={isActive ? <Check fontSize="small" /> : undefined}
                  color={isActive ? 'primary' : 'default'}
                  variant={isActive ? 'filled' : 'outlined'}
                  sx={(theme) => ({
                    '&.MuiChip-filled': {
                      ...FILTER_COLORS[filter].light,
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      '&:hover': {
                        backgroundColor: \`color-mix(in srgb, \${FILTER_COLORS[filter].light.backgroundColor} 50%, #fff)\`,
                      },
                      ...theme.applyStyles('dark', {
                        ...FILTER_COLORS[filter].dark,
                        '&:hover': {
                          backgroundColor: \`color-mix(in srgb, \${FILTER_COLORS[filter].dark.backgroundColor} 90%, #fff)\`,
                        },
                      }),
                    },
                    '&.MuiChip-outlined': {
                      borderColor: FILTER_COLORS[filter].light.borderColor,
                      color: FILTER_COLORS[filter].light.color,
                      '&:hover': {
                        backgroundColor: FILTER_COLORS[filter].light.backgroundColor,
                      },
                      ...theme.applyStyles('dark', {
                        color: FILTER_COLORS[filter].dark.color,
                        borderColor: FILTER_COLORS[filter].dark.borderColor,
                        '&:hover': {
                          backgroundColor: FILTER_COLORS[filter].dark.backgroundColor,
                        },
                      }),
                    },
                  })}
                />
              }
            />
          );
        })}
      </Stack>
      <Link
        component="button"
        variant="body2"
        onClick={onTogglePresentToday}
        sx={(theme) => ({
          color: showPresentToday ? 'primary.main' : 'text.secondary',
          textDecoration: 'none',
          paddingTop: '2px',
          fontWeight: 'medium',
          '&:hover': {
            textDecoration: 'underline',
          },
          ...theme.applyStyles('dark', {
            color: showPresentToday ? 'primary.light' : 'text.secondary',
          }),
        })}
      >
        {showPresentToday ? '(Show all employees)' : '(Hide out today)'}
      </Link>
    </Stack>
  );
}`,
    category: 'components',
    priority: 2,
  },

  'CalendarNavigation.tsx': {
    content: `import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Tooltip from '@mui/material/Tooltip';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { usePickerContext, useSplitFieldProps } from '@mui/x-date-pickers/hooks';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import useForkRef from '@mui/utils/useForkRef';
import { format } from 'date-fns';
import { ToolbarButton } from '@mui/x-data-grid-premium';
import { useCalendarContext } from './CalendarContext';
import { CalendarSearch } from './CalendarSearch';

function ButtonField(props: any) {
  const { forwardedProps } = useSplitFieldProps(props, 'date');
  const pickerContext = usePickerContext();
  const handleRef = useForkRef(pickerContext.triggerRef, pickerContext.rootRef);
  const valueStr = format(pickerContext.value, pickerContext.fieldFormat);

  return (
    <ToolbarButton
      {...forwardedProps}
      ref={handleRef}
      onClick={() => pickerContext.setOpen((prev) => !prev)}
      render={
        <Button variant="outlined" size="small">
          {pickerContext.label ?? valueStr}
        </Button>
      }
    />
  );
}

function CalendarNavigation() {
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
    <Box sx={{ display: 'flex', gap: 1 }}>
      <CalendarSearch />
      <ToolbarButton
        onClick={() => handleDateChange(new Date())}
        render={
          <Button variant="outlined" size="small">
            Today
          </Button>
        }
      />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          value={currentDate}
          onChange={handleDateChange}
          open={isDatePickerOpen}
          onOpen={() => setIsDatePickerOpen(true)}
          onClose={() => setIsDatePickerOpen(false)}
          minDate={dateConstraints.minDate}
          maxDate={dateConstraints.maxDate}
          views={['month']}
          slots={{ field: ButtonField }}
        />
      </LocalizationProvider>
      <Box sx={{ display: 'flex' }}>
        <Tooltip title="Previous month">
          <ToolbarButton size="small" onClick={handlePreviousMonth}>
            <ChevronLeft />
          </ToolbarButton>
        </Tooltip>
        <Tooltip title="Next month">
          <ToolbarButton size="small" onClick={handleNextMonth}>
            <ChevronRight />
          </ToolbarButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

export { CalendarNavigation };
`,
    category: 'components',
    priority: 4,
  },

  'CalendarContext.tsx': {
    content: `import * as React from 'react';
import { useCalendarState } from './hooks/useCalendarState';

export const CalendarContext = React.createContext<ReturnType<typeof useCalendarState> | undefined>(
  undefined,
);

export function useCalendarContext() {
  const context = React.useContext(CalendarContext);

  if (context === undefined) {
    throw new Error('Missing context');
  }

  return context;
}`,
    category: 'context',
    priority: 1,
  },

  'hooks/useCalendarState.ts': {
    content: `import * as React from 'react';
import { addMonths, subMonths } from 'date-fns';
import { FilterType } from '../types/pto';
import { DATE_CONSTRAINTS } from '../constants';

export const useCalendarState = () => {
  const [density, setDensity] = React.useState<'compact' | 'comfortable'>('compact');
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [isDatePickerOpen, setIsDatePickerOpen] = React.useState(false);
  const [activeFilters, setActiveFilters] = React.useState<FilterType[]>([
    'holidays',
    'vacation',
    'sick',
  ]);
  const [showPresentToday, setShowPresentToday] = React.useState(false);

  const handlePreviousMonth = React.useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = subMonths(prev, 1);
      return newDate >= DATE_CONSTRAINTS.minDate ? newDate : prev;
    });
  }, []);

  const handleNextMonth = React.useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = addMonths(prev, 1);
      return newDate <= DATE_CONSTRAINTS.maxDate ? newDate : prev;
    });
  }, []);

  const handleDateChange = React.useCallback((newDate: Date | null) => {
    if (newDate && newDate >= DATE_CONSTRAINTS.minDate && newDate <= DATE_CONSTRAINTS.maxDate) {
      setCurrentDate(newDate);
      setIsDatePickerOpen(false);
    }
  }, []);

  const handleFilterRemove = React.useCallback((filter: FilterType) => {
    setActiveFilters((prev) => prev.filter((f) => f !== filter));
  }, []);

  const handleFilterAdd = React.useCallback((filter: FilterType) => {
    setActiveFilters((prev) => [...prev, filter]);
  }, []);

  const handleTogglePresentToday = React.useCallback(() => {
    setShowPresentToday((prev) => !prev);
  }, []);

  return {
    density,
    setDensity,
    currentDate,
    isDatePickerOpen,
    setIsDatePickerOpen,
    activeFilters,
    showPresentToday,
    dateConstraints: DATE_CONSTRAINTS,
    handlePreviousMonth,
    handleNextMonth,
    handleDateChange,
    handleFilterRemove,
    handleFilterAdd,
    handleTogglePresentToday,
  };
};`,
    category: 'hooks',
    priority: 1,
  },

  'types/pto.ts': {
    content: `export interface PTOData {
  [key: string]: {
    ptoDates: string[];
    sickDates: string[];
    nationality: string;
    team: string;
    birthday: string;
    avatar: string;
  };
}

export interface RowData {
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

export type FilterType = 'holidays' | 'vacation' | 'sick';

export interface HolidayData {
  [country: string]: {
    [date: string]: string;
  };
}

export interface EmployeeStatus {
  isOutToday: boolean;
  isPresentToday: boolean;
}`,
    category: 'types',
    priority: 1,
  },
});
