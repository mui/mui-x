import { DateOrTimeViewWithMeridiem } from '../models/common';
import { createStepNavigation } from './createStepNavigation';

export function createNonRangePickerStepNavigation(
  parameters: CreateNonRangePickerStepNavigationParameters,
) {
  const { steps } = parameters;

  return createStepNavigation({
    steps,
    isCurrentViewMatchingStep: (view, step) => {
      return step.views == null || step.views.includes(view);
    },
    onStepChange: ({ step, initialView, setView, view, views }) => {
      const targetView =
        step.views == null ? initialView : step.views.find((viewBis) => views.includes(viewBis));
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

interface CreateNonRangePickerStepNavigationParameters {
  steps: PickerStep[] | null;
}
