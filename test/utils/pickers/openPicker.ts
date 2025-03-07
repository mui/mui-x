import { fireEvent, screen } from '@mui/internal-test-utils';
import { getFieldSectionsContainer } from 'test/utils/pickers/fields';

export type OpenPickerParams =
  | {
      type: 'date' | 'date-time' | 'time';
    }
  | {
      type: 'date-range' | 'date-time-range';
      initialFocus: 'start' | 'end';
      fieldType: 'single-input' | 'multi-input';
    };

export const openPicker = (params: OpenPickerParams) => {
  const isRangeType = params.type === 'date-range' || params.type === 'date-time-range';
  if (isRangeType && params.fieldType === 'multi-input') {
    const fieldSectionsContainer = getFieldSectionsContainer(params.initialFocus === 'end' ? 1 : 0);
    fireEvent.click(fieldSectionsContainer);
    return true;
  }

  const target =
    params.type === 'time'
      ? screen.getByLabelText(/choose time/i)
      : screen.getByLabelText(/choose date/i);

  fireEvent.click(target);
  return true;
};
