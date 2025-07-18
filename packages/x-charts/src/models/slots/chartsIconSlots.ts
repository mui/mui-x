import * as React from 'react';

export interface ChartsIconSlotProps {}

export type ChartsIconSlots = {
  [key in keyof ChartsIconSlotProps]: React.ComponentType<ChartsIconSlotProps[key]>;
};
