import { ChartsBaseSlots, ChartsIconSlots } from '@mui/x-charts/models';
import { defaultSlotsMaterial as communityDefaultSlotsMaterial } from '@mui/x-charts/internals';
import { ChartsBaseSlotPropsPro } from '../slots/chartsBaseSlots';
import { ChartsIconSlotPropsPro, ChartsIconSlotsPro } from '../slots/chartsIconSlots';
import { ChartsExportIcon, ChartsZoomInIcon, ChartsZoomOutIcon } from './icons';
import { BaseDivider } from './components/BaseDivider';
import { BaseMenuItem } from './components/BaseMenuItem';
import { BaseMenuList } from './components/BaseMenuList';
import { BasePopper } from './components/BasePopper';
import { BaseTooltip } from './components/BaseTooltip';

// Ensures the module augmentation is applied correctly
// eslint-disable-next-line no-restricted-imports
import {} from '@mui/x-charts';

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
