import * as React from 'react';
import type { PickersSectionElement } from '../../PickersSectionList';
import { UseFieldResponse } from '../../internals/hooks/useField';

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
    propsForwardedToHiddenInput: Pick<
      UseFieldResponse<true, {}>,
      'value' | 'onChange' | 'readOnly' | 'disabled'
      // TODO: Add id and name
    > & { ref: React.Ref<HTMLInputElement> };
    propsForwardedToContent: Pick<
      UseFieldResponse<true, {}>,
      'onClick' | 'onKeyDown' | 'onInput' | 'onPaste' | 'tabIndex'
    >;
    contentRef: React.Ref<HTMLSpanElement>;
    registerSectionRef: (sectionIndex: number, ref: HTMLSpanElement | null) => void;
    registerSectionContentRef: (sectionIndex: number, ref: HTMLSpanElement | null) => void;
  }
}

export { PickersFieldProvider };
