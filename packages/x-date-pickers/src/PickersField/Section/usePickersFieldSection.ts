import * as React from 'react';
import { PickersSectionElement } from '../../PickersSectionList';

export function usePickersFieldSection(
  params: UsePickersFieldSection.Parameters,
): UsePickersFieldSection.ReturnValue {
  const { section } = params;

  const getSectionProps: UsePickersFieldSection.ReturnValue['getSectionProps'] = React.useCallback(
    (externalProps = {}) => {
      return {
        children: section.content.children,
      };
    },
    [],
  );

  // TODO: Memoize?
  return { getSectionProps };
}

export namespace UsePickersFieldSection {
  export interface Parameters {
    section: PickersSectionElement;
  }

  export interface ReturnValue {
    /**
     * Resolver for the section element's props.
     * @param externalProps custom props for the section element
     * @returns props that should be spread on the section element
     */
    getSectionProps: (
      externalProps?: React.ComponentPropsWithRef<'span'>,
    ) => React.ComponentPropsWithRef<'span'>;
  }
}
