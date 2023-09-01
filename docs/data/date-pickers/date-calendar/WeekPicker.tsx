import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import isBetweenPlugin from 'dayjs/plugin/isBetween';
import { styled } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';

dayjs.extend(isBetweenPlugin);

interface CustomPickerDayProps extends PickersDayProps<Dayjs> {
  isSelected: boolean;
  isHovered: boolean;
}

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== 'isSelected' && prop !== 'isHovered',
})<CustomPickerDayProps>(({ theme, isSelected, isHovered, day }) => ({
  ...((isSelected || isHovered) && {
    borderRadius: 0,
  }),
  ...(isSelected && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.main,
    },
  }),
  ...(isHovered && {
    backgroundColor: theme.palette.primary.light,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.primary.light,
    },
  }),
  ...(day.day() === 0 && {
    borderTopLeftRadius: '50%',
    borderBottomLeftRadius: '50%',
  }),
  ...(day.day() === 6 && {
    borderTopRightRadius: '50%',
    borderBottomRightRadius: '50%',
  }),
})) as React.ComponentType<CustomPickerDayProps>;

const isInSameWeek = (dayA: Dayjs, dayB: Dayjs | null | undefined) => {
  if (dayB == null) {
    return false;
  }

  return dayA.isSame(dayB, 'week');
};

function Day(
    props: PickersDayProps<Dayjs> & {
      selectedDay?: Dayjs | null;
      hoveredDay?: Dayjs | null;
    },
) {
  const { day, selectedDay, hoveredDay, ...other } = props;

  const dayIsBetween = (target: Dayjs | null | undefined) =>
      target == null
          ? false
          : day.isBetween(
              target.startOf('week'),
              target.endOf('week'),
              null,
              '[]',
          );

  return (
      <CustomPickersDay
          {...other}
          day={day}
          sx={(dayIsBetween(selectedDay) || dayIsBetween(hoveredDay)) ? { px: 2.5, mx: 0 } : {}}
          selected={false}
          isSelected={isInSameWeek(day, selectedDay)}
          isHovered={isInSameWeek(day, hoveredDay)}
      />
  );
}

export default function WeekPicker() {
  const [hoveredDay, setHoveredDay] = React.useState<Dayjs | null>(null);
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-17'));

  return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
            value={value}
            onChange={(newValue) => setValue(newValue)}
            showDaysOutsideCurrentMonth
            displayWeekNumber
            slots={{ day: Day }}
            slotProps={{
              day: (ownerState) =>
                  ({
                    selectedDay: value,
                    hoveredDay,
                    onMouseEnter: () => setHoveredDay(ownerState.day),
                    onMouseLeave: () => setHoveredDay(null),
                  } as any),
            }}
        />
      </LocalizationProvider>
  );
}
