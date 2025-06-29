import * as React from 'react';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import { type ChartsBaseSlotProps, ChartsBaseSlots, ChartsIconSlots } from '@mui/x-charts/models';
import { defaultSlotsMaterial as communityDefaultSlotsMaterial } from '@mui/x-charts/internals';
import { BaseMenuItem } from './components/BaseMenuItem';
import { BaseMenuList } from './components/BaseMenuList';
import { BasePopper } from './components/BasePopper';
import { ChartsBaseSlotPropsPro } from '../slots/chartsBaseSlots';
import { ChartsExportIcon, ChartsZoomInIcon, ChartsZoomOutIcon } from './icons';
import { ChartsIconSlotPropsPro, ChartsIconSlotsPro } from '../slots/chartsIconSlots';

const BaseDivider = React.forwardRef<any, ChartsBaseSlotProps['baseDivider']>(function BaseDivider(
  { material, ...rest },
  ref,
) {
  return <Divider {...rest} {...material} ref={ref} />;
});

export const BaseTooltip = React.forwardRef<any, ChartsBaseSlotPropsPro['baseTooltip']>(
  function BaseTooltip({ material, ...rest }, ref) {
    return <Tooltip {...rest} {...material} ref={ref} />;
  },
);

const baseSlots: Omit<ChartsBaseSlots, keyof ChartsBaseSlots> = {
  baseTooltip: BaseTooltip,
  basePopper: BasePopper,
  baseMenuList: BaseMenuList,
  baseMenuItem: BaseMenuItem,
  baseDivider: BaseDivider,
};

const iconSlots: Omit<ChartsIconSlotsPro, keyof ChartsIconSlots> = {
  zoomInIcon: ChartsZoomInIcon,
  zoomOutIcon: ChartsZoomOutIcon,
  exportIcon: ChartsExportIcon,
};

export type ChartsSlotsPro = ChartsBaseSlots & ChartsIconSlotsPro;

export type ChartsSlotPropsPro = ChartsBaseSlotPropsPro & ChartsIconSlotPropsPro;

export const defaultSlotsMaterial: ChartsSlotsPro = {
  ...communityDefaultSlotsMaterial,
  ...baseSlots,
  ...iconSlots,
};
