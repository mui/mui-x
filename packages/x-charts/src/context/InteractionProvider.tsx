import * as React from 'react';
import { ChartItemIdentifier, ChartSeriesType } from '../models/seriesType/config';

export interface InteractionProviderProps {
  children: React.ReactNode;
}

export type ItemInteractionData<T extends ChartSeriesType> = ChartItemIdentifier<T>;

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

type InteractionActions<T extends ChartSeriesType = ChartSeriesType> =
  | {
      type: 'enterItem';
      data: ItemInteractionData<T>;
    }
  | {
      type: 'leaveItem';
      data: ItemInteractionData<T>;
    }
  | {
      type: 'updateAxis';
      data: AxisInteractionData;
    };

type InteractionState = {
  /**
   * The item currently interacting.
   */
  item: null | ItemInteractionData<ChartSeriesType>;
  /**
   * The x- and y-axes currently interacting.
   */
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
        (Object.keys(action.data) as (keyof ItemInteractionData<ChartSeriesType>)[]).some(
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
