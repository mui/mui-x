import { screen, userEvent } from '@mui/monorepo/test/utils';

export type OpenPickerParams =
  | {
      type: 'date' | 'date-time' | 'time';
      variant: 'mobile' | 'desktop';
    }
  | {
      type: 'date-range';
      variant: 'mobile' | 'desktop';
      initialFocus: 'start' | 'end';
      /**
       * @default false
       */
      isSingleInput?: boolean;
    };

export const openPicker = (params: OpenPickerParams) => {
  if (params.type === 'date-range') {
    if (params.isSingleInput) {
      const target = screen.getByRole<HTMLInputElement>('textbox');
      userEvent.mousePress(target);
      const cursorPosition = params.initialFocus === 'start' ? 0 : target.value.length - 1;

      return target.setSelectionRange(cursorPosition, cursorPosition);
    }

    const target = screen.getAllByRole('textbox')[params.initialFocus === 'start' ? 0 : 1];

    return userEvent.mousePress(target);
  }

  if (params.variant === 'mobile') {
    return userEvent.mousePress(screen.getByRole('textbox'));
  }

  const target =
    params.type === 'time'
      ? screen.getByLabelText(/choose time/i)
      : screen.getByLabelText(/choose date/i);
  return userEvent.mousePress(target);
};
