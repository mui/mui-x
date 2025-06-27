import { BaseButton } from './components/BaseButton';
import { BaseIconButton } from './components/BaseIconButton';
import type { ChartsBaseSlotProps, ChartsBaseSlots } from '../../models/slots/chartsBaseSlots';
import type { ChartsIconSlotProps, ChartsIconSlots } from '../../models/slots/chartsIconSlots';
import { NullComponent } from './components/NullComponent';

import './augmentation';

const baseSlots: ChartsBaseSlots = {
  baseButton: BaseButton,
  baseIconButton: BaseIconButton,

  // Null components should be overridden by higher plan packages
  baseDivider: NullComponent,
  basePopper: NullComponent,
  baseTooltip: NullComponent,
  baseMenuItem: NullComponent,
  baseMenuList: NullComponent,
};

const iconSlots: ChartsIconSlots = {};

export type ChartsSlots = ChartsBaseSlots & ChartsIconSlots;

export type ChartsSlotProps = ChartsBaseSlotProps & ChartsIconSlotProps;

export const defaultSlotsMaterial: ChartsSlots = { ...baseSlots, ...iconSlots };
