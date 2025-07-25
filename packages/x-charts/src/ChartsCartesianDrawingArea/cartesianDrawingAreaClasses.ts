import composeClasses from '@mui/utils/composeClasses';

export interface CartesianDrawingAreaClasses {
  /** Styles applied to the root element. */
  root: string;
}

export type CartesianDrawingAreaClassKey = keyof CartesianDrawingAreaClasses;

export function getCartesianDrawingAreaUtilityClass(slot: string): string {
  return `MuiChartsCartesianDrawingArea-${slot}`;
}

export const cartesianDrawingAreaClasses: CartesianDrawingAreaClasses = {
  root: getCartesianDrawingAreaUtilityClass('root'),
};

export const useUtilityClasses = (
  classes?: Partial<CartesianDrawingAreaClasses>,
): CartesianDrawingAreaClasses => {
  const slots = {
    root: ['root'],
  };

  return composeClasses(slots, getCartesianDrawingAreaUtilityClass, classes);
};
