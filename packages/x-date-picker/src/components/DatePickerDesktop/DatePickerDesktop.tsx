import * as React from 'react';
import { DatePickerDesktopProps } from './DatePickerDesktopProps';
import { DatePickerInput } from '../DatePickerInput';

import { PickersPopper } from '../PickersPopper';
import { CalendarPicker } from '../CalendarPicker';

export const DatePickerDesktop = (props: DatePickerDesktopProps) => {
  const { value, onChange } = props;
  const [open, setOpen] = React.useState(false);

  const onClose = React.useCallback(() => setOpen(false), []);

  const onOpen = React.useCallback(() => setOpen(true), []);

  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <React.Fragment>
      <DatePickerInput
        value={value}
        onChange={onChange}
        onOpenPopper={onOpen}
        isPopperOpened={open}
        ref={inputRef}
      />
      <PickersPopper role="dialog" open={open} anchorEl={inputRef.current} onClose={onClose}>
        <CalendarPicker />
      </PickersPopper>
    </React.Fragment>
  );
};
