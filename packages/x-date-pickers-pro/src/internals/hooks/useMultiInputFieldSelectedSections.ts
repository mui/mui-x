import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import useEventCallback from '@mui/utils/useEventCallback';
import { UseFieldInternalProps } from '@mui/x-date-pickers/internals';
import { FieldRef, FieldSelectedSections } from '@mui/x-date-pickers/models';
import { RangeFieldSection } from '../../models';

interface UseMultiInputFieldSelectedSectionsParams
  extends Pick<
    UseFieldInternalProps<any, any, RangeFieldSection, any, any>,
    'selectedSections' | 'onSelectedSectionsChange'
  > {
  unstableStartFieldRef?: React.Ref<FieldRef<RangeFieldSection>>;
  unstableEndFieldRef?: React.Ref<FieldRef<RangeFieldSection>>;
}

export const useMultiInputFieldSelectedSections = (
  params: UseMultiInputFieldSelectedSectionsParams,
) => {
  const unstableEndFieldRef = React.useRef<FieldRef<RangeFieldSection>>(null);
  const handleUnstableEndFieldRef = useForkRef(params.unstableEndFieldRef, unstableEndFieldRef);

  const [startSelectedSection, setStartSelectedSection] = React.useState<FieldSelectedSections>(
    params.selectedSections ?? null,
  );
  const [endSelectedSection, setEndSelectedSection] = React.useState<FieldSelectedSections>(null);

  const getActiveField = () => {
    if (unstableEndFieldRef.current && unstableEndFieldRef.current.isFieldFocused()) {
      return 'end';
    }

    return 'start';
  };

  const handleStartSelectedSectionChange = useEventCallback(
    (newSelectedSections: FieldSelectedSections) => {
      setStartSelectedSection(newSelectedSections);
      if (getActiveField() === 'start') {
        params.onSelectedSectionsChange?.(newSelectedSections);
      }
    },
  );

  const handleEndSelectedSectionChange = useEventCallback(
    (newSelectedSections: FieldSelectedSections) => {
      setEndSelectedSection(newSelectedSections);
      if (getActiveField() === 'end') {
        params.onSelectedSectionsChange?.(newSelectedSections);
      }
    },
  );

  const activeField = getActiveField();

  return {
    start: {
      unstableFieldRef: params.unstableStartFieldRef,
      selectedSections:
        activeField === 'start' && params.selectedSections !== undefined
          ? params.selectedSections
          : startSelectedSection,
      onSelectedSectionsChange: handleStartSelectedSectionChange,
    },
    end: {
      unstableFieldRef: handleUnstableEndFieldRef,
      selectedSections:
        activeField === 'end' && params.selectedSections !== undefined
          ? params.selectedSections
          : endSelectedSection,
      onSelectedSectionsChange: handleEndSelectedSectionChange,
    },
  };
};
