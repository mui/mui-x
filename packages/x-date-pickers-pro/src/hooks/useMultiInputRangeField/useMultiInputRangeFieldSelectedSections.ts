'use client';
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
  extends
    Pick<
      UseFieldInternalProps<PickerRangeValue, any, any>,
      'selectedSections' | 'onSelectedSectionsChange'
    >,
    MultiInputFieldRefs {}

export interface UseMultiInputFieldSelectedSectionsResponseItem {
  fieldRef?: React.Ref<FieldRef<PickerValue>>;
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
  const endFieldRef = React.useRef<FieldRef<PickerValue>>(null);
  const handleEndFieldRef = useForkRef(parameters.endFieldRef, endFieldRef);

  const [startSelectedSection, setStartSelectedSection] = React.useState<FieldSelectedSections>(
    parameters.selectedSections ?? null,
  );
  const [endSelectedSection, setEndSelectedSection] = React.useState<FieldSelectedSections>(null);

  const getActiveField = () => {
    if (endFieldRef.current && endFieldRef.current.isFieldFocused()) {
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
      fieldRef: parameters.startFieldRef,
      selectedSections:
        activeField === 'start' && parameters.selectedSections !== undefined
          ? parameters.selectedSections
          : startSelectedSection,
      onSelectedSectionsChange: handleStartSelectedSectionChange,
    },
    end: {
      fieldRef: handleEndFieldRef,
      selectedSections:
        activeField === 'end' && parameters.selectedSections !== undefined
          ? parameters.selectedSections
          : endSelectedSection,
      onSelectedSectionsChange: handleEndSelectedSectionChange,
    },
  };
};
