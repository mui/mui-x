import * as React from 'react';
import pick from 'lodash/pick';

export type CustomizationOptions = { [key: string]: string };

export interface UseCustomizationPlaygroundProps {
  customizationLabels: CustomizationOptions;
  examples: {
    [key: string]: {
      [key: string]: string;
    };
  };
  demoRef: React.MutableRefObject<null>;
}

const getInteractionTarget = (
  target: HTMLElement,
  demoRef: React.MutableRefObject<null>,
  examples: UseCustomizationPlaygroundProps['examples'],
): string | null => {
  const checkSubComponent = (element: HTMLElement) => {
    return Object.keys(examples).find((className) =>
      element.classList.contains(`Mui${className}-root`),
    );
  };
  let interactionTarget: string | null = null;

  while (target !== demoRef.current) {
    if (target.classList) {
      const match = checkSubComponent(target);
      if (match) {
        interactionTarget = match;
        break;
      }
    }
    target = target.parentNode as HTMLElement;
  }

  return interactionTarget;
};

export function useCustomizationPlayground({
  customizationLabels,
  examples,
  demoRef,
}: UseCustomizationPlaygroundProps) {
  const [selectedDemo, setSelectedDemo] = React.useState<string | null>(null);
  const [hoveredDemo, setHoveredDemo] = React.useState<string | null>(null);
  const [customizationOptions, setCustomizationOptions] =
    React.useState<CustomizationOptions | null>(null);
  const [selectedCustomizationOption, setSelectedCustomizationOption] = React.useState<
    string | null
  >(null);

  const selectDemo = (interactionTarget: string) => {
    // set the selected subcomponent name
    setSelectedDemo(interactionTarget);
    // set the array of customization options to the available options for the selected subcomponent
    setCustomizationOptions(pick(customizationLabels, Object.keys(examples[interactionTarget])));
    // set the selected customization option to the first available option for the selected subcomponent
    setSelectedCustomizationOption(Object.keys(examples[interactionTarget])[0] as string);
  };
  const handleDemoClick = (event: React.MouseEvent<HTMLElement>) => {
    const clickTarget = getInteractionTarget(event.target as HTMLElement, demoRef, examples);
    if (clickTarget) {
      selectDemo(clickTarget);
    }
  };

  const handleDemoHover = (event: React.MouseEvent<HTMLElement>) => {
    const hoverTarget = getInteractionTarget(event.target as HTMLElement, demoRef, examples);

    if (hoverTarget) {
      setHoveredDemo(hoverTarget);
    } else {
      setHoveredDemo(null);
    }
  };

  return {
    selectedDemo,
    hoveredDemo,
    customizationOptions,
    selectedCustomizationOption,
    handleDemoClick,
    handleDemoHover,
    selectDemo,
    setHoveredDemo,
    setSelectedCustomizationOption,
  };
}
