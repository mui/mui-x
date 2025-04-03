import * as React from 'react';
import useForkRef from '@mui/utils/useForkRef';
import useEventCallback from '@mui/utils/useEventCallback';
import {
  PickerRangeValue,
  PickerValue,
  UseFieldInternalProps,
} from '@mui/x-date-pickers/internals';
import { FieldRef, FieldSelectedSections } from '@mui/x-date-pickers/models';
import { MultiInputFieldRefs } from '../../models';

interface UseMultiInputRangeFieldSelectedSectionsParameters
  extends Pick<
      UseFieldInternalProps<PickerRangeValue, any, any>,
      'selectedSections' | 'onSelectedSectionsChange'
    >,
    MultiInputFieldRefs {}

export interface UseMultiInputFieldSelectedSectionsResponseItem {
  unstableFieldRef?: React.Ref<FieldRef<PickerValue>>;
  selectedSections: FieldSelectedSections;
  onSelectedSectionsChange: (newSelectedSections: FieldSelectedSections) => void;
}

interface UseMultiInputFieldSelectedSectionsResponse {
  start: UseMultiInputFieldSelectedSectionsResponseItem;
  end: UseMultiInputFieldSelectedSectionsResponseItem;
}

/**
 * @ignore - internal hook.
 */
export const useMultiInputRangeFieldSelectedSections = (
  parameters: UseMultiInputRangeFieldSelectedSectionsParameters,
): UseMultiInputFieldSelectedSectionsResponse => {
  const unstableEndFieldRef = React.useRef<FieldRef<PickerValue>>(null);
  const handleUnstableEndFieldRef = useForkRef(parameters.unstableEndFieldRef, unstableEndFieldRef);

  const [startSelectedSection, setStartSelectedSection] = React.useState<FieldSelectedSections>(
    parameters.selectedSections ?? null,
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
        parameters.onSelectedSectionsChange?.(newSelectedSections);
      }
    },
  );

  const handleEndSelectedSectionChange = useEventCallback(
    (newSelectedSections: FieldSelectedSections) => {
      setEndSelectedSection(newSelectedSections);
      if (getActiveField() === 'end') {
        parameters.onSelectedSectionsChange?.(newSelectedSections);
      }
    },
  );

  const activeField = getActiveField();

  return {
    start: {
      unstableFieldRef: parameters.unstableStartFieldRef,
      selectedSections:
        activeField === 'start' && parameters.selectedSections !== undefined
          ? parameters.selectedSections
          : startSelectedSection,
      onSelectedSectionsChange: handleStartSelectedSectionChange,
    },
    end: {
      unstableFieldRef: handleUnstableEndFieldRef,
      selectedSections:
        activeField === 'end' && parameters.selectedSections !== undefined
          ? parameters.selectedSections
          : endSelectedSection,
      onSelectedSectionsChange: handleEndSelectedSectionChange,
    },
  };
};
