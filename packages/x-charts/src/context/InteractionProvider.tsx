import * as React from 'react';
import { ChartItemIdentifier, ChartSeriesType } from '../models/seriesType/config';

export interface InteractionProviderProps {
  children: React.ReactNode;
}

export type ItemInteractionData<T extends ChartSeriesType> = ChartItemIdentifier<T>;

export type AxisInteractionData = {
  x: null | {
    value: number | Date | string;
    index?: number;
  };
  y: null | {
    value: number | Date | string;
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
      data: Partial<ItemInteractionData<T>>;
    }
  | {
      type: 'exitChart';
    }
  | {
      type: 'updateVoronoiUsage';
      useVoronoiInteraction: boolean;
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
  /**
   * Set to `true` when `VoronoiHandler` is active.
   * Used to prevent collision with mouseEnter events.
   */
  useVoronoiInteraction: boolean;
  dispatch: React.Dispatch<InteractionActions>;
};

export const InteractionContext = React.createContext<InteractionState>({
  item: null,
  axis: { x: null, y: null },
  useVoronoiInteraction: false,
  dispatch: () => null,
});

if (process.env.NODE_ENV !== 'production') {
  InteractionContext.displayName = 'InteractionContext';
}

const dataReducer: React.Reducer<Omit<InteractionState, 'dispatch'>, InteractionActions> = (
  prevState,
  action,
) => {
  switch (action.type) {
    case 'enterItem':
      return { ...prevState, item: action.data };

    case 'exitChart':
      if (prevState.item === null && prevState.axis.x === null && prevState.axis.y === null) {
        return prevState;
      }
      return { ...prevState, axis: { x: null, y: null }, item: null };

    case 'updateVoronoiUsage':
      return { ...prevState, useVoronoiInteraction: action.useVoronoiInteraction };

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
      if (action.data.x === prevState.axis.x && action.data.y === prevState.axis.y) {
        return prevState;
      }
      return { ...prevState, axis: action.data };

    default:
      return prevState;
  }
};

function InteractionProvider(props: InteractionProviderProps) {
  const { children } = props;
  const [data, dispatch] = React.useReducer(dataReducer, {
    item: null,
    axis: { x: null, y: null },
    useVoronoiInteraction: false,
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

export { InteractionProvider };
