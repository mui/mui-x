import type { MakeOptional } from '@mui/x-internals/types';
import { ChartsRadiusAxisProps, ChartsRotationAxisProps } from './models/axis';
import type { AxisConfig, ChartsXAxisProps, ChartsYAxisProps, ScaleName } from './models';

export type XAxis = MakeOptional<AxisConfig<ScaleName, any, ChartsXAxisProps>, 'id'>;
export type YAxis = MakeOptional<AxisConfig<ScaleName, any, ChartsYAxisProps>, 'id'>;
export type RotationAxis = AxisConfig<ScaleName, any, ChartsRotationAxisProps>;
export type RadiusAxis = AxisConfig<'linear', any, ChartsRadiusAxisProps>;
