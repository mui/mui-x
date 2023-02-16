export type Scales = 'linear' | 'band' | 'log' | 'point' | 'pow' | 'sqrt' | 'time' | 'utc';

export type AxisConfig = {
  id: string;
  scale?: Scales;
  min?: number;
  max?: number;
  data?: any[];
};
