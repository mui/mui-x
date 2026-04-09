import { fireEvent, screen, MuiRenderResult } from '@mui/internal-test-utils';
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

// user-event refuses to click elements with `pointer-events: none` (e.g.
// disabled/readOnly pickers). Tests that intentionally try to open such
// pickers — to verify the `onOpen` callback is not called — need the click
// to go through anyway. Falling back to `fireEvent.click` keeps the assertion
// meaningful without tripping user-event's check.
const clickTarget = async (user: MuiRenderResult['user'], target: Element) => {
  try {
    await user.click(target);
  } catch (error) {
    if (error instanceof Error && error.message.includes('pointer-events: none')) {
      fireEvent.click(target);
      return;
    }
    throw error;
  }
};

export const openPicker = async (user: MuiRenderResult['user'], params: OpenPickerParams) => {
  const isRangeType =
    params.type === 'date-range' ||
    params.type === 'date-time-range' ||
    params.type === 'time-range';
  if (isRangeType && params.fieldType === 'multi-input') {
    const fieldSectionsContainer = getFieldSectionsContainer(params.initialFocus === 'end' ? 1 : 0);
    await clickTarget(user, fieldSectionsContainer);
    return true;
  }

  const target = screen.getByLabelText(/(choose date)|(choose time)|(choose range)/i);

  await clickTarget(user, target);
  return true;
};
