import { generateUtilityClass, generateUtilityClasses } from '@material-ui/unstyled';

export interface LineChartClasses {
  /** Styles applied to the root element. */
  root: string;
}

export type LineChartClassKey = keyof LineChartClasses;

export function getLineChartUtilityClass(slot: string): string {
  return generateUtilityClass('MuiLineChart', slot);
}

const lineChartClasses: LineChartClasses = generateUtilityClasses('MuiLineChart', ['root']);

export default lineChartClasses;
