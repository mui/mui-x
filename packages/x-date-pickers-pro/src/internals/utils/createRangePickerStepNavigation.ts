import {
  DateOrTimeViewWithMeridiem,
  RangePosition,
  createStepNavigation,
} from '@mui/x-date-pickers/internals';
import { UseRangePositionResponse } from '../hooks/useRangePosition';

export function createRangePickerStepNavigation(
  parameters: CreateRangePickerStepNavigationParameters,
) {
  const { steps, rangePositionResponse } = parameters;

  return createStepNavigation({
    steps,
    isViewMatchingStep: (view, step) => {
      if (step.rangePosition !== rangePositionResponse.rangePosition) {
        return false;
      }

      return step.views == null || step.views.includes(view);
    },
    onStepChange: ({ step, defaultView, setView, view, views }) => {
      if (step.rangePosition !== rangePositionResponse.rangePosition) {
        rangePositionResponse.setRangePosition(step.rangePosition);
      }

      const targetView =
        step.views == null ? defaultView : step.views.find((viewBis) => views.includes(viewBis));
      if (targetView !== view) {
        setView(targetView);
      }
    },
  });
}

export interface PickerRangeStep {
  /**
   * The views that are handled inside this step.
   * If null, all views are handled by this step.
   */
  views: readonly DateOrTimeViewWithMeridiem[] | null;
  rangePosition: RangePosition;
}

interface CreateRangePickerStepNavigationParameters {
  steps: PickerRangeStep[] | null;
  rangePositionResponse: UseRangePositionResponse;
}
