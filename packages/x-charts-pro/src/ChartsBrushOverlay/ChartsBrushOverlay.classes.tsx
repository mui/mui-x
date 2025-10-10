import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface BrushOverlayClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the brush lines. */
  line: string;
  /** Styles applied to the brush rectangles. */
  rect: string;
  /** Styles applied when using the horizontal brush mode. */
  horizontal: string;
  /** Styles applied when using the vertical brush mode. */
  vertical: string;
  /** Styles applied when using the orthogonal brush mode. */
  orthogonal: string;
}

export type BrushOverlayClassKey = keyof BrushOverlayClasses;

export const brushOverlayClasses: BrushOverlayClasses = generateUtilityClasses('MuiBrushOverlay', [
  'root',
  'line',
  'rect',
  'horizontal',
  'vertical',
  'orthogonal',
]);
