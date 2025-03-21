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

    const previousStep = currentStepIndex < 1 ? null : steps[currentStepIndex - 1];
    const nextStep =
      currentStepIndex === -1 || currentStepIndex === steps.length - 1
        ? null
        : steps[currentStepIndex + 1];

    return {
      hasNextStep: nextStep != null,
      hasPreviousStep: previousStep != null,
      goToPreviousStep: () => {
        if (previousStep == null) {
          return;
        }
        onStepChange({ step: previousStep, ...parametersBis });
      },
      goToNextStep: () => {
        if (nextStep == null) {
          return;
        }
        onStepChange({ step: nextStep, ...parametersBis });
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
  hasPreviousStep: boolean;
  hasNextStep: boolean;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
};

interface UseStepNavigationReturnValueParameters {
  initialView: DateOrTimeViewWithMeridiem;
  view: DateOrTimeViewWithMeridiem;
  setView: (view: any) => void;
}

interface UseRangePickerStepNavigationOnStepChangeParameters<TStep extends {}>
  extends UseStepNavigationReturnValueParameters {
  step: TStep;
}
