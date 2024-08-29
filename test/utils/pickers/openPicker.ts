import { fireEvent, screen } from '@mui/internal-test-utils';
import { getFieldSectionsContainer } from 'test/utils/pickers/fields';
import { pickersInputBaseClasses } from '@mui/x-date-pickers/PickersTextField';

export type OpenPickerParams =
  | {
      type: 'date' | 'date-time' | 'time';
      variant: 'mobile' | 'desktop';
      click?: (element: Element) => Promise<void>;
    }
  | {
      type: 'date-range' | 'date-time-range';
      variant: 'mobile' | 'desktop';
      initialFocus: 'start' | 'end';
      /**
       * @default false
       */
      isSingleInput?: boolean;
      click?: (element: Element) => Promise<void>;
    };

export const openPicker = async (params: OpenPickerParams) => {
  const isRangeType = params.type === 'date-range' || params.type === 'date-time-range';
  const fieldSectionsContainer = getFieldSectionsContainer(
    isRangeType && !params.isSingleInput && params.initialFocus === 'end' ? 1 : 0,
  );
  const { click = fireEvent.click } = params;

  if (isRangeType) {
    await click(fieldSectionsContainer);

    if (params.isSingleInput && params.initialFocus === 'end') {
      const sections = fieldSectionsContainer.querySelectorAll(
        `.${pickersInputBaseClasses.sectionsContainer}`,
      );

      await click(sections[sections.length - 1]);
    }

    return true;
  }

  if (params.variant === 'mobile') {
    await click(fieldSectionsContainer);

    return true;
  }

  const target =
    params.type === 'time'
      ? screen.getByLabelText(/choose time/i)
      : screen.getByLabelText(/choose date/i);

  await click(target);
  return true;
};
