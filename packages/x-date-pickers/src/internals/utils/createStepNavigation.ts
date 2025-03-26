import { DateOrTimeViewWithMeridiem } from '../models';

export function createStepNavigation<TStep extends {}>(
  parameters: CreateStepNavigationParameters<TStep>,
) {
  const { steps, isCurrentViewMatchingStep, onStepChange } = parameters;

  return (parametersBis: CreateStepNavigationReturnValueParameters) => {
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

interface CreateStepNavigationParameters<TStep extends {}> {
  steps: TStep[] | null;
  isCurrentViewMatchingStep: (view: DateOrTimeViewWithMeridiem, step: TStep) => boolean;
  onStepChange: (parameters: UseRangePickerStepNavigationOnStepChangeParameters<TStep>) => void;
}

export type CreateStepNavigationReturnValue = (
  parameters: CreateStepNavigationReturnValueParameters,
) => {
  hasNextStep: boolean;
  goToNextStep: () => void;
};

export interface CreateStepNavigationReturnValueParameters {
  initialView: DateOrTimeViewWithMeridiem;
  view: DateOrTimeViewWithMeridiem;
  views: readonly DateOrTimeViewWithMeridiem[];
  setView: (view: any) => void;
}

interface UseRangePickerStepNavigationOnStepChangeParameters<TStep extends {}>
  extends CreateStepNavigationReturnValueParameters {
  step: TStep;
}
