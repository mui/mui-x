import * as React from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function PopperComponent() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label="Basic date picker"
        views={['month', 'year']}
        minDate={dayjs(new Date(2022, 0, 1))}
        maxDate={dayjs(new Date(2024, 12, 31))}
        reduceAnimations
        slotProps={{
          popper: {
            modifiers: [
              {
                name: 'viewHeightModifier',
                enabled: true,
                phase: 'beforeWrite',
                fn: ({ state }: { state: Partial<any> }) => {
                  state.styles.popper.height = '320px';
                  if (state.placement.includes('top-start')) {
                    state.styles.popper = {
                      ...state.styles.popper,
                      display: 'flex',
                      alignItems: 'flex-end',
                    };
                  }
                  if (state.placement.includes('bottom')) {
                    state.styles.popper = {
                      ...state.styles.popper,
                      display: 'block',
                    };
                  }
                },
              },
            ],
          },
        }}
      />
    </LocalizationProvider>
  );
}
