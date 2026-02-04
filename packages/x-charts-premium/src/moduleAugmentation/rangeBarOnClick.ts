import { type RangeBarValueType } from '../models';

declare module '@mui/x-charts/models' {
  interface ChartsTypeFeatureFlags {
    seriesValuesOverride: RangeBarValueType | number | null | undefined;
  }
}

// Required to make this file into a module
export default {};
