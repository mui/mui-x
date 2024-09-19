import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Card from '@mui/material/Card';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import { PickersShortcutsItem } from '@mui/x-date-pickers/PickersShortcuts';
import {
  PickersLayoutProps,
  usePickerLayout,
  pickersLayoutClasses,
  PickersLayoutRoot,
  PickersLayoutContentWrapper,
} from '@mui/x-date-pickers/PickersLayout';
import { DateRange } from '@mui/x-date-pickers-pro/models';

const shortcutsItems: PickersShortcutsItem<DateRange<Dayjs>>[] = [
  {
    label: 'This Week',
    getValue: () => {
      const today = dayjs();
      return [today.startOf('week'), today.endOf('week')];
    },
  },
  {
    label: 'Last Week',
    getValue: () => {
      const today = dayjs();
      const prevWeek = today.subtract(7, 'day');
      return [prevWeek.startOf('week'), prevWeek.endOf('week')];
    },
  },
  {
    label: 'Last 7 Days',
    getValue: () => {
      const today = dayjs();
      return [today.subtract(7, 'day'), today];
    },
  },
  {
    label: 'Current Month',
    getValue: () => {
      const today = dayjs();
      return [today.startOf('month'), today.endOf('month')];
    },
  },
  {
    label: 'Next Month',
    getValue: () => {
      const today = dayjs();
      const startOfNextMonth = today.endOf('month').add(1, 'day');
      return [startOfNextMonth, startOfNextMonth.endOf('month')];
    },
  },
  { label: 'Reset', getValue: () => [null, null] },
];

interface CustomLayoutProps extends PickersLayoutProps<DateRange<Dayjs>, Dayjs, 'day'> {
  isHorizontal?: boolean;
}
function CustomLayout(props: CustomLayoutProps) {
  const { isHorizontal, ...other } = props;
  const { tabs, content, shortcuts } = usePickerLayout(other);

  return (
    <PickersLayoutRoot
      ownerState={props}
      sx={{
        overflow: 'auto',
        [`.${pickersLayoutClasses.shortcuts}`]: isHorizontal
          ? {
              gridColumn: 2,
              gridRow: 1,
              display: 'flex',
              flexGrow: 1,
              maxWidth: '100%',
            }
          : {},
        [`.${pickersLayoutClasses.contentWrapper}`]: {
          flexGrow: 1,
          alignItems: 'center',
        },
      }}
    >
      {shortcuts}
      <PickersLayoutContentWrapper className={pickersLayoutClasses.contentWrapper}>
        {tabs}
        {content}
      </PickersLayoutContentWrapper>
    </PickersLayoutRoot>
  );
}

export default function DateRangeWithShortcuts() {
  const theme = useTheme();
  const showTwoCalendars = useMediaQuery('(min-width:700px)');
  const lgDown = useMediaQuery(theme.breakpoints.down('lg'));
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));
  const xlDown = useMediaQuery(theme.breakpoints.down('xl'));
  return (
    <Card variant="outlined" sx={{ flexGrow: 1 }}>
      <StaticDateRangePicker
        calendars={lgDown && showTwoCalendars ? 2 : 1}
        slots={{ layout: CustomLayout }}
        slotProps={{
          shortcuts: {
            items: smUp ? shortcutsItems : [],
          },
          layout: { isHorizontal: xlDown && smUp } as CustomLayoutProps,
        }}
      />
    </Card>
  );
}
