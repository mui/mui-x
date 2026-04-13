// POC entry for the new types pipeline. At build time the loader
// `@mui/internal-docs-infra/pipeline/loadPrecomputedTypes` rewrites the
// `createTypes` call below with fully resolved type metadata.
import { Gauge } from '@mui/x-charts/Gauge';
import { createTypes } from 'docsx/src/modules/api-docs/createTypes';

export const TypesGauge = createTypes(import.meta.url, Gauge);
