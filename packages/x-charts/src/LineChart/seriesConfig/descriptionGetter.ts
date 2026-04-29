import { createLineStyleDescriptionGetter } from '../../internals/createLineStyleDescriptionGetter';

const descriptionGetter = createLineStyleDescriptionGetter<'line'>(
  (params) => params.xAxis,
);

export default descriptionGetter;
