import * as React from 'react';
import { styled, lighten } from '@mui/material/styles';
import { useForkRef } from '@mui/material/utils';
import { CalendarTodayRounded } from '../icons';
import { DatePickerInputProps } from './DatePickerInputProps';
import { useDateUtils } from '../../hooks/utils/useDateUtils';

const DatePickerInputRoot = styled('div')(({ theme }) => ({
  width: '100%',
  height: 24,
  padding: 4,
  display: 'flex',
  alignItems: 'center',
  border: `2px solid transparent`,
  borderRadius: 10,
  '&.opened': {
    borderColor: theme.palette.primary.main,
  },
}));

const DatePickerDateInput = styled('input')(({ theme }) => ({
  border: 'none',
  '&:focus': {
    backgroundColor: lighten(theme.palette.primary.main, 0.88),
    outline: 0,
  },
}));

interface InternalValue {
  date: string;
  time: string;
  iso: string;
}

/**
 * TODO: Handle time
 */
export const DatePickerInput = React.forwardRef<HTMLDivElement, DatePickerInputProps>(
  (props, ref) => {
    const { value, onChange, onOpenPopper, isPopperOpened } = props;

    const rootRef = React.useRef<HTMLDivElement>(null);
    const handleRef = useForkRef(rootRef, ref);

    const utils = useDateUtils<Date>();

    const [stateValue, setStateValue] = React.useState<InternalValue>(() => {
      return {
        date: utils.format(utils.startOfDay(value), 'fullDate'),
        time: '',
        iso: utils.toISO(value),
      };
    });

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const dateStr = event.target.value;
      const previousDate = utils.parseISO(stateValue.iso);

      const date = utils.parse(dateStr, utils.formats.fullDate);
      if (date != null && utils.isValid(date)) {
        const newDate = utils.mergeDateAndTime(date, previousDate);
        onChange(newDate);
      }

      setStateValue((prev) => ({ ...prev, date: dateStr }));
    };

    React.useEffect(() => {
      // TODO: Handle transition
      setTimeout(() => {
        if (
          !isPopperOpened &&
          document.activeElement instanceof HTMLElement &&
          rootRef.current!.contains(document.activeElement)
        ) {
          document.activeElement.blur();
        }
      });
    }, [isPopperOpened]);

    return (
      <DatePickerInputRoot
        ref={handleRef}
        onClick={onOpenPopper}
        className={isPopperOpened ? 'opened' : undefined}
      >
        <CalendarTodayRounded fontSize="small" />
        <DatePickerDateInput onChange={handleDateChange} value={stateValue.date} />
      </DatePickerInputRoot>
    );
  },
);
