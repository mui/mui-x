import * as React from 'react';

const PickersFieldContext = React.createContext<PickersFieldProvider.ContextValue | null>(null);

function PickersFieldProvider(props: PickersFieldProvider.Props) {
  const { value, children } = props;
  return <PickersFieldContext.Provider value={value}>{children}</PickersFieldContext.Provider>;
}

namespace PickersFieldProvider {
  export interface Props {
    value: PickersFieldProvider.ContextValue;
    children: React.ReactNode;
  }

  export interface ContextValue {}
}

export { PickersFieldProvider };
