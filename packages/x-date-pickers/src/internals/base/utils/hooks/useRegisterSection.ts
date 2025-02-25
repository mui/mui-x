import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { PickerValidDate } from '../../../../models';

export function useRegisterSection<T extends string>(): useRegisterSection.ReturnValue<T> {
  const sectionsRef = React.useRef<{ [key in T]?: Record<number, PickerValidDate> }>({});

  const registerSection = useEventCallback(
    (section: useRegisterSection.RegisterSectionParameters<T>) => {
      const id = Math.random();
      if (!sectionsRef.current[section.type]) {
        sectionsRef.current[section.type] = {};
      }

      sectionsRef.current[section.type]![id] = section.value;
      return () => {
        delete sectionsRef.current[section.type]?.[id];
      };
    },
  );

  return { sectionsRef, registerSection };
}

export namespace useRegisterSection {
  export interface RegisterSectionParameters<T extends string> {
    type: T;
    value: PickerValidDate;
  }

  export type SectionsRef<T extends string> = React.RefObject<{
    [key in T]?: Record<number, PickerValidDate>;
  }>;

  export interface ReturnValue<T extends string> {
    sectionsRef: SectionsRef<T>;
    registerSection: (section: RegisterSectionParameters<T>) => () => void;
  }
}
