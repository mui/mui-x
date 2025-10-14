import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface BrushOverlayClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the brush lines. */
  rect: string;
  /** Styles applied when the brush is selecting the x axis. */
  x: string;
  /** Styles applied when the brush is selecting the y axis. */
  y: string;
}

export type BrushOverlayClassKey = keyof BrushOverlayClasses;

export const brushOverlayClasses: BrushOverlayClasses = generateUtilityClasses(
  'MuiChartsBrushOverlay',
  ['root', 'rect', 'x', 'y'],
);
