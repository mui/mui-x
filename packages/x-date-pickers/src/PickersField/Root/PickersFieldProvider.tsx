import * as React from 'react';
import type { PickersSectionElement } from '../../PickersSectionList';

const PickersFieldContext = React.createContext<PickersFieldProvider.ContextValue | null>(null);

export const usePickersFieldContext = () => {
  const context = React.useContext(PickersFieldContext);
  if (context === null) {
    throw new Error('MUI X: usePickersFieldContext must be used inside a PickersField component');
  }

  return context;
};

function PickersFieldProvider(props: PickersFieldProvider.Props) {
  const { value, children } = props;
  return <PickersFieldContext.Provider value={value}>{children}</PickersFieldContext.Provider>;
}

namespace PickersFieldProvider {
  export interface Props {
    value: PickersFieldProvider.ContextValue;
    children: React.ReactNode;
  }

  export interface ContextValue {
    elements: PickersSectionElement[];
    contentEditable: boolean;
    contentRef: React.RefObject<HTMLDivElement>;
    registerSectionRef: (sectionIndex: number, ref: HTMLSpanElement | null) => void;
    registerSectionContentRef: (sectionIndex: number, ref: HTMLSpanElement | null) => void;
  }
}

export { PickersFieldProvider };
