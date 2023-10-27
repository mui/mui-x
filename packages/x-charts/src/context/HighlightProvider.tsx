import * as React from 'react';
import { ChartItemIdentifier, ChartSeriesType } from '../models/seriesType/config';

export interface HighlightProviderProps {
  children: React.ReactNode;
}

export type ItemHighlighData<T extends ChartSeriesType> = ChartItemIdentifier<T>;

export type HighlightOptions = 'none' | 'item' | 'series';
export type FadeOptions = 'none' | 'series' | 'global';

export type HighlightScope = {
  highlighted: HighlightOptions;
  faded: FadeOptions;
};
type HighlighActions<T extends ChartSeriesType = ChartSeriesType> =
  | {
      type: 'enterItem';
      item: ItemHighlighData<T>;
      scope?: Partial<HighlightScope>;
    }
  | {
      type: 'leaveItem';
      item: ItemHighlighData<T>;
    };

type HighlighState = {
  item: null | ItemHighlighData<ChartSeriesType>;
  scope: HighlightScope;
  dispatch: React.Dispatch<HighlighActions>;
};

const defaultScope: HighlightScope = { highlighted: 'none', faded: 'none' };

export const HighlighContext = React.createContext<HighlighState>({
  item: null,
  scope: defaultScope,
  dispatch: () => null,
});

const dataReducer: React.Reducer<Omit<HighlighState, 'dispatch'>, HighlighActions> = (
  prevState,
  action,
) => {
  switch (action.type) {
    case 'enterItem':
      return {
        ...prevState,
        item: action.item,
        scope: { ...defaultScope, ...action.scope },
      };

    case 'leaveItem':
      if (
        prevState.item === null ||
        (Object.keys(action.item) as (keyof ItemHighlighData<ChartSeriesType>)[]).some(
          (key) => action.item[key] !== prevState.item![key],
        )
      ) {
        // The item is already something else
        return prevState;
      }
      return { ...prevState, item: null };

    default:
      return prevState;
  }
};

export function HighlightProvider({ children }: HighlightProviderProps) {
  const [data, dispatch] = React.useReducer(dataReducer, {
    item: null,
    scope: defaultScope,
  });

  const value = React.useMemo(
    () => ({
      ...data,
      dispatch,
    }),
    [data],
  );

  return <HighlighContext.Provider value={value}>{children}</HighlighContext.Provider>;
}
