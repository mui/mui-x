import * as React from 'react';
import { PickersSectionElement } from '../../PickersSectionList';

const PickersFieldSectionContext =
  React.createContext<PickersFieldSectionProvider.ContextValue | null>(null);

export const usePickersFieldSectionContext = () => {
  const context = React.useContext(PickersFieldSectionContext);
  if (context === null) {
    throw new Error(
      'MUI X: usePickersFieldSectionContext must be used inside a PickersFieldSection component',
    );
  }

  return context;
};

function PickersFieldSectionProvider(props: PickersFieldSectionProvider.Props) {
  const { value, children } = props;
  return (
    <PickersFieldSectionContext.Provider value={value}>
      {children}
    </PickersFieldSectionContext.Provider>
  );
}

namespace PickersFieldSectionProvider {
  export interface Props {
    value: PickersFieldSectionProvider.ContextValue;
    children: React.ReactNode;
  }

  export interface ContextValue {
    index: number;
    element: PickersSectionElement;
  }
}

export { PickersFieldSectionProvider };
