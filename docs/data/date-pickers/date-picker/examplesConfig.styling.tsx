import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import {
  StaticDatePicker,
  StaticDatePickerProps,
} from '@mui/x-date-pickers/StaticDatePicker';
import {
  DesktopDatePicker,
  DesktopDatePickerProps,
} from '@mui/x-date-pickers/DesktopDatePicker';
import { DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { PickersSubcomponentType } from 'docsx/src/modules/utils/useCustomizationPlayground';

type PickerExamplesType<TComponent, TComponentProps> = {
  name: string;
  component: TComponent;
  componentProps: TComponentProps;
  examples: PickersSubcomponentType;
};

export const staticDatePickerExamples: PickersSubcomponentType = {
  PickersToolbar: {
    examples: {
      customTheme: {
        type: 'success',
      },
      sxProp: {
        type: 'success',
      },
      styledComponents: {
        type: 'success',
      },
    },
    slots: ['root', 'content'],
  },
  DateCalendar: {
    examples: {
      customTheme: {
        type: 'success',
      },
      sxProp: {
        type: 'success',
      },
      styledComponents: {
        type: 'success',
      },
    },
    slots: ['root'],
  },
  PickersCalendarHeader: {
    examples: {
      customTheme: {
        type: 'success',
      },
      sxProp: {
        type: 'success',
      },
      styledComponents: {
        type: 'success',
      },
    },
    slots: ['root', 'label', 'labelContainer', 'switchViewButton', 'switchViewIcon'],
  },
  DayCalendar: {
    examples: {
      customTheme: {
        type: 'success',
      },
      sxProp: {
        type: 'success',
      },

      styledComponents: {
        type: 'success',
      },
    },
    slots: [
      'root',
      'weekDayLabel',
      'weekContainer',
      'weekNumberLabel',
      'weekNumber',
    ],
  },
  PickersDay: {
    examples: {
      customTheme: {
        type: 'success',
      },
      sxProp: {
        type: 'success',
      },

      styledComponents: {
        type: 'success',
      },
    },
    slots: ['root', 'today'],
  },
  MonthCalendar: {
    examples: {
      customTheme: {
        type: 'success',
        componentProps: { views: ['month'] },
      },
      sxProp: {
        type: 'success',
        componentProps: { views: ['month'] },
      },

      styledComponents: {
        type: 'success',
        componentProps: { views: ['month'] },
      },
    },
    slots: ['root'],
  },
  PickersMonth: {
    examples: {
      customTheme: {
        type: 'success',
        componentProps: { views: ['month'] },
      },
      sxProp: {
        type: 'success',
        componentProps: { views: ['month'] },
      },

      styledComponents: {
        type: 'success',
        componentProps: { views: ['month'] },
      },
    },
    slots: ['root', 'monthButton'],
  },
};

function TextFieldMoreInfo() {
  return (
    <Typography>
      Check{' '}
      <Link href="/material-ui/react-text-field/#customization">
        TextField component docs
      </Link>{' '}
      for customization examples.
    </Typography>
  );
}

export const datePickerExamples: PickersSubcomponentType = {
  DateCalendar: {
    examples: {
      customTheme: {
        type: 'success',
      },
      sxProp: {
        type: 'warning',
        parentSlot: 'layout',
        comments:
          'Because of the structure of the DesktopDatePicker, the `sx` prop needs to be applied to the `layout` slot',
      },
      styledComponents: {
        type: 'warning',
        parentSlot: 'layout',
        parentComponent: 'PickersLayout',
        comments:
          'Because of the structure of the DesktopDatePicker and the way the popper renders, the `layout` slot will need to be replaced with a wtyled component',
      },
    },
    slots: ['root'],
  },
  PickersCalendarHeader: {
    examples: {
      customTheme: {
        type: 'success',
      },
      sxProp: {
        type: 'warning',
        parentSlot: 'layout',
        comments:
          'Because of the structure of the DesktopDatePicker, the `sx` prop needs to be applied to the `layout` slot',
      },
      styledComponents: {
        type: 'warning',
        parentSlot: 'layout',
        parentComponent: 'PickersLayout',
        comments:
          'Because of the structure of the DesktopDatePicker and the way the popper renders, the `layout` slot will need to be replaced with a wtyled component',
      },
    },
    slots: ['root', 'label', 'labelContainer', 'switchViewButton', 'switchViewIcon'],
  },
  DayCalendar: {
    examples: {
      customTheme: {
        type: 'success',
      },
      sxProp: {
        type: 'warning',
        parentSlot: 'layout',
        comments:
          'Because of the structure of the DesktopDatePicker, the `sx` prop needs to be applied to the `layout` slot',
      },
      styledComponents: {
        type: 'warning',
        parentSlot: 'layout',
        parentComponent: 'PickersLayout',
        comments:
          'Because of the structure of the DesktopDatePicker and the way the popper renders, the `layout` slot will need to be replaced with a wtyled component',
      },
    },
    slots: [
      'root',
      'weekDayLabel',
      'weekContainer',
      'weekNumberLabel',
      'weekNumber',
    ],
  },
  PickersDay: {
    examples: {
      customTheme: {
        type: 'success',
      },
      sxProp: {
        type: 'warning',
        parentSlot: 'layout',
        comments:
          'Because of the structure of the DesktopDatePicker, the `sx` prop needs to be applied to the `layout` slot',
      },
      styledComponents: {
        type: 'warning',
        parentSlot: 'layout',
        parentComponent: 'PickersLayout',
        comments:
          'Because of the structure of the DesktopDatePicker and the way the popper renders, the `layout` slot will need to be replaced with a wtyled component',
      },
    },
    slots: ['root', 'today'],
  },
  PickersMonth: {
    examples: {
      customTheme: {
        type: 'success',
        componentProps: { views: ['month'] },
      },
      sxProp: {
        type: 'warning',
        parentSlot: 'layout',
        comments:
          'Because of the structure of the DesktopDatePicker, the `sx` prop needs to be applied to the `layout` slot',
        componentProps: { views: ['month'] },
      },

      styledComponents: {
        type: 'warning',
        parentSlot: 'layout',
        parentComponent: 'PickersLayout',
        comments:
          'Because of the structure of the DesktopDatePicker and the way the popper renders, the `layout` slot will need to be replaced with a wtyled component',
        componentProps: { views: ['month'] },
      },
    },
    slots: ['root', 'monthButton'],
  },
  TextField: {
    examples: {
      customTheme: {
        type: 'info',
        comments:
          'This approach would change the styles of all the TextField components in the application. Consider using a nested theme with this style wrapping your local picker component to isolate this override',
      },
      sxProp: {
        type: 'success',
        parentSlot: 'textField',
        current: true,
        comments: 'You can apply the sx prop to the `TextField` via slotProps',
      },
      styledComponents: {
        type: 'success',
        parentSlot: 'textField',
        parentComponent: 'TextField',
        comments: 'You can style the `TextField` component directly',
        current: true,
      },
    },
    slots: ['root'],
    moreInformation: <TextFieldMoreInfo />,
  },
};

const pickerProps: DatePickerProps<Dayjs> = {
  views: ['day', 'month', 'year'],
  monthsPerRow: 3,
  yearsPerRow: 3,
  minDate: dayjs(new Date(2020, 0, 1)),
  maxDate: dayjs(new Date(2028, 12, 31)),
  displayWeekNumber: true,
};

export const pickerExamples = [
  {
    name: 'StaticDatePicker',
    component: StaticDatePicker,
    componentProps: { ...pickerProps, orientation: 'portrait' },
    examples: staticDatePickerExamples,
  } as PickerExamplesType<typeof StaticDatePicker, StaticDatePickerProps<Dayjs>>,
  {
    name: 'DesktopDatePicker',
    component: DesktopDatePicker,
    componentProps: {
      open: true,
      reduceAnimations: true,
      slotProps: {
        popper: {
          sx: { zIndex: 1 },
          disablePortal: true,
          placement: 'bottom-start',
          modifiers: [
            {
              name: 'flip',
              options: {
                fallbackPlacements: ['bottom-start'],
              },
            },
          ],
        },
      },
      ...pickerProps,
    },
    examples: datePickerExamples,
  } as PickerExamplesType<typeof DesktopDatePicker, DesktopDatePickerProps<Dayjs>>,
];
