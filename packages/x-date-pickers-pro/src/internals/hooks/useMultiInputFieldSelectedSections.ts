import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import useEventCallback from '@mui/utils/useEventCallback';
import { UseFieldInternalProps } from '@mui/x-date-pickers/internals';
import { FieldRef, FieldSelectedSections } from '@mui/x-date-pickers/models';

interface UseMultiInputFieldSelectedSectionsParams
  extends Pick<
    UseFieldInternalProps<true, any, any>,
    'selectedSections' | 'onSelectedSectionsChange'
  > {
  unstableStartFieldRef?: React.Ref<FieldRef<true>>;
  unstableEndFieldRef?: React.Ref<FieldRef<true>>;
}

export const useMultiInputFieldSelectedSections = (
  params: UseMultiInputFieldSelectedSectionsParams,
) => {
  const unstableEndFieldRef = React.useRef<FieldRef<true>>(null);
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
      unstableFieldRef: params.unstableStartFieldRef as React.Ref<FieldRef<false>>,
      selectedSections:
        activeField === 'start' && params.selectedSections !== undefined
          ? params.selectedSections
          : startSelectedSection,
      onSelectedSectionsChange: handleStartSelectedSectionChange,
    },
    end: {
      unstableFieldRef: handleUnstableEndFieldRef as React.Ref<FieldRef<false>>,
      selectedSections:
        activeField === 'end' && params.selectedSections !== undefined
          ? params.selectedSections
          : endSelectedSection,
      onSelectedSectionsChange: handleEndSelectedSectionChange,
    },
  };
};
