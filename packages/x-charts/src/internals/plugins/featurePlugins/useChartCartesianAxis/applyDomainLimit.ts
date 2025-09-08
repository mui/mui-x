import { getScale } from '../../../getScale';
import { ScaleName } from '../../../../models/axis';

export type DomainLimit = 
  | 'nice' 
  | 'strict' 
  | ((min: number, max: number) => { min: number; max: number });

/**
 * Applies domain limit transformations to extrema and creates a scale.
 * This utility handles the common logic shared between computeAxisValue and createAxisFilterMapper.
 * 
 * @param extrema - The min/max values as a tuple [min, max]
 * @param domainLimit - The domain limit configuration
 * @param scaleType - The scale type to use
 * @param range - The output range for the scale
 * @param niceTickCount - Optional tick count to pass to .nice() when domainLimit is 'nice'
 * @returns Object containing the final scale and transformed extrema
 */
export function applyDomainLimit<T extends number | Date>(
  extrema: readonly [T, T],
  domainLimit: DomainLimit,
  scaleType: ScaleName,
  range: readonly [number, number],
  niceTickCount?: number
) {
  // Apply domain limit function if provided
  let adjustedExtrema = extrema;
  if (typeof domainLimit === 'function') {
    const { min: adjustedMin, max: adjustedMax } = domainLimit(
      extrema[0] as number,
      extrema[1] as number
    );
    adjustedExtrema = [adjustedMin as T, adjustedMax as T] as const;
  }

  const scale = getScale(scaleType ?? 'linear', adjustedExtrema, range);
  const finalScale = domainLimit === 'nice' 
    ? (niceTickCount !== undefined ? scale.nice(niceTickCount) : scale.nice())
    : scale;

  return {
    scale: finalScale,
    adjustedExtrema,
  };
}