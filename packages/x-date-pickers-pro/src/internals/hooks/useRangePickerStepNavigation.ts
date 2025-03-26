import {
  DateOrTimeViewWithMeridiem,
  RangePosition,
  createStepNavigation,
} from '@mui/x-date-pickers/internals';
import { UseRangePositionResponse } from './useRangePosition';

export function useRangePickerStepNavigation(parameters: UseRangePickerStepNavigationParameters) {
  const { steps, rangePositionResponse } = parameters;

  return createStepNavigation({
    steps,
    isCurrentViewMatchingStep: (view, step) => {
      if (step.rangePosition !== rangePositionResponse.rangePosition) {
        return false;
      }

      return step.views == null || step.views.includes(view);
    },
    onStepChange: ({ step, initialView, setView, view, views }) => {
      if (step.rangePosition !== rangePositionResponse.rangePosition) {
        rangePositionResponse.setRangePosition(step.rangePosition);
      }

      const targetView =
        step.views == null ? initialView : step.views.find((viewBis) => views.includes(viewBis));
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

interface UseRangePickerStepNavigationParameters {
  steps: PickerRangeStep[] | null;
  rangePositionResponse: UseRangePositionResponse;
}
