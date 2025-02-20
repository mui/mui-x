import { ChartsLabelMarkProps } from './ChartsLabelMark';

export interface ChartsLabelMarkSlots {
  /**
   * Symbol next to the legend.
   * TODO: Improve
   */
  legendLabelMark?: React.JSXElementConstructor<ChartsLabelMarkProps>;
}

export interface ChartsLabelMarkSlotProps {
  legendLabelMark?: ChartsLabelMarkProps;
}

export interface ChartsLabelMarkSlotExtension {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: ChartsLabelMarkSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: ChartsLabelMarkSlotProps;
}
