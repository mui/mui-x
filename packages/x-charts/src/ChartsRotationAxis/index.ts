import { ChartsRotationAxis } from './ChartsRotationAxis';

export { ChartsRotationAxis } from './ChartsRotationAxis';
/**
 * @deprecated rotation axis is now stable, import `ChartsRotationAxis` instead
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const Unstable_ChartsRotationAxis = ChartsRotationAxis;

export {
  type ChartsRadialAxisClasses,
  type ChartsRadialAxisClassKey,
  chartsRadialAxisClasses,
} from './chartsRotationAxisClasses';

// Re-export types
export { type ChartsRotationAxisProps } from '../models/axis';
