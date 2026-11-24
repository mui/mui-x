import type { DensityKey, ResolvedDensityScale } from '@mui/material/styles';
import type { DensityScale, DensityStepKey } from './densityScale';

declare const materialKey: DensityKey;
declare const localKey: DensityStepKey;
declare const materialScale: ResolvedDensityScale;
declare const localScale: DensityScale;

export const keyFromMaterial: DensityStepKey = materialKey;
export const keyToMaterial: DensityKey = localKey;
export const scaleFromMaterial: DensityScale = materialScale;
export const scaleToMaterial: ResolvedDensityScale = localScale;
