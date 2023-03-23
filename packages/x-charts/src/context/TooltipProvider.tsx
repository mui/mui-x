import * as React from 'react';

export interface TooltipProviderProps {
  trigger?: 'item' | 'axis';
  children: React.ReactNode;
}

export type ItemTooltipData = {
  seriesType: string;
  seriesId: string;
  dataIndex: number;
  target: SVGElement;
};

export type AxisTooltipData = {
  dataIndex: number;
};

type TooltipState = {
  trigger: 'item' | 'axis';
  data: null | ItemTooltipData | AxisTooltipData;
  dispatch: React.Dispatch<
    | {
        type: 'enter';
        data: ItemTooltipData | AxisTooltipData;
      }
    | {
        type: 'leave';
        data: ItemTooltipData | AxisTooltipData;
      }
  >;
};

export const TooltipContext = React.createContext<TooltipState>({
  trigger: 'axis',
  data: null,
  dispatch: () => null,
});

const tooltipDataReducer = (
  prevState: null | ItemTooltipData | AxisTooltipData,
  action:
    | { type: 'enter'; data: ItemTooltipData | AxisTooltipData }
    | { type: 'leave'; data: ItemTooltipData | AxisTooltipData },
) => {
  if (prevState === null || action.type === 'enter') {
    return action.data;
  }
  if (
    Object.keys(action.data).every((key) => key === 'target' || action.data[key] === prevState[key])
  ) {
    return null;
  }
  return prevState;
};

export function TooltipProvider({ trigger = 'axis', children }: TooltipProviderProps) {
  const [data, dispatch] = React.useReducer(tooltipDataReducer, null);

  const value = React.useMemo(
    () => ({
      trigger,
      data,
      dispatch,
    }),
    [trigger, data],
  );

  return <TooltipContext.Provider value={value}>{children}</TooltipContext.Provider>;
}
