import { DateOrTimeViewWithMeridiem } from '../models';

/**
 * Create an object that determines whether there is a next step and allows to go to the next step.
 * @param {CreateStepNavigationParameters<TStep>} parameters The parameters of the createStepNavigation function
 * @returns {CreateStepNavigationReturnValue} The return value of the createStepNavigation function
 */
export function createStepNavigation<TStep extends {}>(
  parameters: CreateStepNavigationParameters<TStep>,
): CreateStepNavigationReturnValue {
  const { steps, isViewMatchingStep, onStepChange } = parameters;

  return (parametersBis) => {
    if (steps == null) {
      return {
        hasNextStep: false,
        goToNextStep: () => {},
        areViewsInSameStep: () => true,
      };
    }

    const currentStepIndex = steps.findIndex((step) =>
      isViewMatchingStep(parametersBis.view, step),
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
      areViewsInSameStep: (viewA, viewB) => {
        const stepA = steps.find((step) => isViewMatchingStep(viewA, step));
        const stepB = steps.find((step) => isViewMatchingStep(viewB, step));
        return stepA === stepB;
      },
    };
  };
}

interface CreateStepNavigationParameters<TStep extends {}> {
  steps: TStep[] | null;
  isViewMatchingStep: (view: DateOrTimeViewWithMeridiem, step: TStep) => boolean;
  onStepChange: (parameters: UseRangePickerStepNavigationOnStepChangeParameters<TStep>) => void;
}

export type CreateStepNavigationReturnValue = (
  parameters: CreateStepNavigationReturnValueParameters,
) => {
  /**
   * Whether there is a next step.
   */
  hasNextStep: boolean;
  /**
   * Go to the next step if any.
   */
  goToNextStep: () => void;
  /**
   * Whether the two views are in the same step.
   * @param {DateOrTimeViewWithMeridiem} viewA The first view to compare.
   * @param {DateOrTimeViewWithMeridiem} viewB The second view to compare.
   * @returns {boolean} Whether the two views are in the same step.
   */
  areViewsInSameStep: (
    viewA: DateOrTimeViewWithMeridiem,
    viewB: DateOrTimeViewWithMeridiem,
  ) => boolean;
};

export interface CreateStepNavigationReturnValueParameters {
  defaultView: DateOrTimeViewWithMeridiem;
  view: DateOrTimeViewWithMeridiem;
  views: readonly DateOrTimeViewWithMeridiem[];
  setView: (view: any) => void;
}

interface UseRangePickerStepNavigationOnStepChangeParameters<TStep extends {}>
  extends CreateStepNavigationReturnValueParameters {
  step: TStep;
}
