import { DateOrTimeViewWithMeridiem } from '../models';

export function useStepNavigation<TStep extends {}>(
  parameters: UseStepNavigationParameters<TStep>,
) {
  const { steps, isCurrentViewMatchingStep, onStepChange } = parameters;

  return (parametersBis: UseStepNavigationReturnValueParameters) => {
    if (steps == null) {
      return {
        hasPreviousStep: false,
        hasNextStep: false,
        goToNextStep: () => {},
        goToPreviousStep: () => {},
      };
    }

    const currentStepIndex = steps.findIndex((step) =>
      isCurrentViewMatchingStep(parametersBis.view, step),
    );

    const nextStep =
      currentStepIndex === -1 || currentStepIndex === steps.length - 1
        ? null
        : steps[currentStepIndex + 1];

    return {
      hasNextStep: nextStep != null,
      goToNextStep: () => {
        if (nextStep == null) {
          return;
        }

        onStepChange({ ...parametersBis, step: nextStep });
      },
    };
  };
}

interface UseStepNavigationParameters<TStep extends {}> {
  steps: TStep[] | null;
  isCurrentViewMatchingStep: (view: DateOrTimeViewWithMeridiem, step: TStep) => boolean;
  onStepChange: (parameters: UseRangePickerStepNavigationOnStepChangeParameters<TStep>) => void;
}

export type UseStepNavigationReturnValue = (parameters: UseStepNavigationReturnValueParameters) => {
  hasNextStep: boolean;
  goToNextStep: () => void;
};

export interface UseStepNavigationReturnValueParameters {
  initialView: DateOrTimeViewWithMeridiem;
  view: DateOrTimeViewWithMeridiem;
  setView: (view: any) => void;
}

interface UseRangePickerStepNavigationOnStepChangeParameters<TStep extends {}>
  extends UseStepNavigationReturnValueParameters {
  step: TStep;
}
