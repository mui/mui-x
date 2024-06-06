import { screen, userEvent } from '@mui/internal-test-utils';
import { getFieldSectionsContainer } from 'test/utils/pickers/fields';
import { pickersInputBaseClasses } from '@mui/x-date-pickers/PickersTextField';

export type OpenPickerParams =
  | {
      type: 'date' | 'date-time' | 'time';
      variant: 'mobile' | 'desktop';
    }
  | {
      type: 'date-range' | 'date-time-range';
      variant: 'mobile' | 'desktop';
      initialFocus: 'start' | 'end';
      /**
       * @default false
       */
      isSingleInput?: boolean;
    };

export const openPicker = (params: OpenPickerParams) => {
  const isRangeType = params.type === 'date-range' || params.type === 'date-time-range';
  const fieldSectionsContainer = getFieldSectionsContainer(
    isRangeType && !params.isSingleInput && params.initialFocus === 'end' ? 1 : 0,
  );

  if (isRangeType) {
    userEvent.mousePress(fieldSectionsContainer);

    if (params.isSingleInput && params.initialFocus === 'end') {
      const sections = fieldSectionsContainer.querySelectorAll(
        `.${pickersInputBaseClasses.sectionsContainer}`,
      );

      userEvent.mousePress(sections[sections.length - 1]);
    }

    return undefined;
  }

  if (params.variant === 'mobile') {
    return userEvent.mousePress(fieldSectionsContainer);
  }

  const target =
    params.type === 'time'
      ? screen.getByLabelText(/choose time/i)
      : screen.getByLabelText(/choose date/i);

  return userEvent.mousePress(target);
};
