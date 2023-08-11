import { BarElementClassKey } from '../BarChart/BarElement';
import { ChartsAxisClassKey } from '../ChartsAxis';
import { ChartsLegendClassKey } from '../ChartsLegend';
import { AreaElementClassKey, LineElementClassKey, MarkElementClassKey } from '../LineChart';

// prettier-ignore
export interface PickersComponentNameToClassKey {
  MuiChartsAxis: ChartsAxisClassKey;
  MuiChartsLegend: ChartsLegendClassKey;

  // BarChart components
  MuiBarElement: BarElementClassKey;
  // LineChart components
  
  MuiAreaElement: AreaElementClassKey;
  MuiLineElement: LineElementClassKey;
  MuiMarkElement: MarkElementClassKey;
  // ScatterChart components
  
}

declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends PickersComponentNameToClassKey {}
}

// disable automatic export
export {};
