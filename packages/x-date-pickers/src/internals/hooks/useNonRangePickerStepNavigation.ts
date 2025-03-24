import { DateOrTimeViewWithMeridiem } from '../models/common';
import { useStepNavigation } from './useStepNavigation';

export function useNonRangePickerStepNavigation(
  parameters: UseNonRangePickerStepNavigationParameters,
) {
  const { steps } = parameters;

  return useStepNavigation({
    steps,
    isCurrentViewMatchingStep: (view, step) => {
      return step.views == null || step.views.includes(view);
    },
    onStepChange: ({ step, initialView, setView, view }) => {
      const targetView = step.views == null ? initialView : step.views[0];
      if (targetView !== view) {
        setView(targetView);
      }
    },
  });
}

export interface PickerStep {
  /**
   * The views that are handled inside this step.
   * If null, all views are handled by this step.
   */
  views: readonly DateOrTimeViewWithMeridiem[] | null;
}

interface UseNonRangePickerStepNavigationParameters {
  steps: PickerStep[] | null;
}
