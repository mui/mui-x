import { createLineStyleDescriptionGetter } from '@mui/x-charts/internals';

const descriptionGetter = createLineStyleDescriptionGetter<'radialLine'>(
  (params) => params.rotationAxis,
);

export default descriptionGetter;
