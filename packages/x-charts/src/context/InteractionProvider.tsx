import * as React from 'react';
import { BarItemIdentifier } from '../models/seriesType/bar';
import { LineItemIdentifier } from '../models/seriesType/line';
import { ScatterItemIdentifier } from '../models/seriesType/scatter';

export interface InteractionProviderProps {
  children: React.ReactNode;
}

export type ItemInteractionData = {
  target?: SVGElement;
} & (BarItemIdentifier | LineItemIdentifier | ScatterItemIdentifier);

export type AxisInteractionData = {
  x: null | {
    value: number | Date;
    index?: number;
  };
  y: null | {
    value: number | Date;
    index?: number;
  };
};

type InteractionActions =
  | {
      type: 'enterItem';
      data: ItemInteractionData;
    }
  | {
      type: 'leaveItem';
      data: ItemInteractionData;
    }
  | {
      type: 'updateAxis';
      data: AxisInteractionData;
    };

type InteractionState = {
  item: null | ItemInteractionData;
  axis: AxisInteractionData;
  dispatch: React.Dispatch<InteractionActions>;
};

export const InteractionContext = React.createContext<InteractionState>({
  item: null,
  axis: { x: null, y: null },
  dispatch: () => null,
});

const dataReducer: React.Reducer<Omit<InteractionState, 'dispatch'>, InteractionActions> = (
  prevState,
  action,
) => {
  switch (action.type) {
    case 'enterItem':
      return { ...prevState, item: action.data };

    case 'leaveItem':
      if (
        prevState.item === null ||
        (Object.keys(action.data) as (keyof ItemInteractionData)[]).some(
          (key) => action.data[key] !== prevState.item![key],
        )
      ) {
        // The item is already something else
        return prevState;
      }
      return { ...prevState, item: null };

    case 'updateAxis':
      return { ...prevState, axis: action.data };

    default:
      return prevState;
  }
};

export function InteractionProvider({ children }: InteractionProviderProps) {
  const [data, dispatch] = React.useReducer(dataReducer, {
    item: null,
    axis: { x: null, y: null },
  });

  const value = React.useMemo(
    () => ({
      ...data,
      dispatch,
    }),
    [data],
  );

  return <InteractionContext.Provider value={value}>{children}</InteractionContext.Provider>;
}
