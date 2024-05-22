import * as React from 'react';
import {
  HighlightedItemData,
  HighlightedContext,
  HighlightedScope,
  HighlightedState,
} from './HighlightedContext';
import { highlightedReducer } from './highlightedReducer';

export type HighlightedProviderProps = {
  children: React.ReactNode;
  highlightedScope?: HighlightedScope;
  highlightedItem?: HighlightedItemData;
};

export function HighlightedProvider({
  children,
  highlightedScope: optionsProps,
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
      setOptions: (options: NonNullable<HighlightedScope>) =>
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
