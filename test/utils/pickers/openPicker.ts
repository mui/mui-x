import { fireEvent, screen } from '@mui/internal-test-utils';
import { getFieldSectionsContainer } from 'test/utils/pickers/fields';

export type PickerComponentType = 'date' | 'date-time' | 'time';

export type PickerRangeComponentType = 'date-range' | 'date-time-range' | 'time-range';

export type OpenPickerParams =
  | {
      type: PickerComponentType;
    }
  | {
      type: PickerRangeComponentType;
      initialFocus: 'start' | 'end';
      fieldType: 'single-input' | 'multi-input';
    };

export const openPicker = (params: OpenPickerParams) => {
  const isRangeType =
    params.type === 'date-range' ||
    params.type === 'date-time-range' ||
    params.type === 'time-range';
  if (isRangeType && params.fieldType === 'multi-input') {
    const fieldSectionsContainer = getFieldSectionsContainer(params.initialFocus === 'end' ? 1 : 0);
    fireEvent.click(fieldSectionsContainer);
    return true;
  }

  const target = screen.getByLabelText(/(choose date)|(choose time)|(choose range)/i);

  fireEvent.click(target);
  return true;
};
