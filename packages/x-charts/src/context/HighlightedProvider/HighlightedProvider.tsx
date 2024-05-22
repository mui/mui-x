import * as React from 'react';
import {
  HighlightedItemData,
  HighlightedContext,
  HighlightedOptions,
  HighlightedState,
} from './HighlightedContext';
import { highlightedReducer } from './highlightedReducer';

type HighlightedProviderProps = {
  children: React.ReactNode;
  options: HighlightedOptions;
  highlightedItem: HighlightedItemData;
};

export function HighlightProvider({
  children,
  options: optionsProps,
  highlightedItem: highlightedItemProps,
}: HighlightedProviderProps) {
  const [state, dispatch] = React.useReducer(highlightedReducer, {
    options: null,
    highlightedItem: null,
    isFaded: () => false,
    isHighlighted: () => false,
  });

  React.useEffect(() => {
    dispatch(
      optionsProps ? { type: 'set-options', options: optionsProps } : { type: 'clear-options' },
    );
  }, [optionsProps]);

  React.useEffect(() => {
    dispatch(
      highlightedItemProps
        ? { type: 'set-highlighted', itemData: highlightedItemProps }
        : { type: 'clear-highlighted' },
    );
  }, [highlightedItemProps]);

  const providerValue: HighlightedState = React.useMemo(
    () => ({
      ...state,
      setOptions: (options: NonNullable<HighlightedOptions>) =>
        dispatch({ type: 'set-options', options }),
      clearOptions: () => dispatch({ type: 'clear-options' }),
      setHighlighted: (itemData: NonNullable<HighlightedItemData>) =>
        dispatch({ type: 'set-highlighted', itemData }),
      clearHighlighted: () => dispatch({ type: 'clear-highlighted' }),
    }),
    [state],
  );

  return (
    <HighlightedContext.Provider value={providerValue}>{children}</HighlightedContext.Provider>
  );
}
