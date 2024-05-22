import * as React from 'react';
import { HighlightedContext, HighlightedOptions } from './HighlightedContext';
import { highlightedReducer } from './highlightedReducer';

type HighlightedProviderProps = {
  children: React.ReactNode;
  options: HighlightedOptions;
};

export function HighlightProvider({ children, options: optionsProps }: HighlightedProviderProps) {
  const [state, dispatch] = React.useReducer(highlightedReducer, {
    options: null,
    isFaded: () => false,
    isHighlighted: () => false,
  });

  React.useEffect(() => {
    dispatch(
      optionsProps
        ? { type: 'set-highlighted', options: optionsProps }
        : { type: 'clear-highlighted' },
    );
  }, [optionsProps]);

  const providerValue = React.useMemo(
    () => ({
      ...state,
      setHighlighted: (options: NonNullable<HighlightedOptions>) =>
        dispatch({ type: 'set-highlighted', options }),
      clearHighlighted: () => dispatch({ type: 'clear-highlighted' }),
    }),
    [state],
  );

  return (
    <HighlightedContext.Provider value={providerValue}>{children}</HighlightedContext.Provider>
  );
}
