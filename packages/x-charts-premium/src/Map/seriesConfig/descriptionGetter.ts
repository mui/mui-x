import { getLabel } from '@mui/x-charts/internals';
import type { DescriptionGetter } from '@mui/x-charts/internals';

const descriptionGetter: DescriptionGetter<'mapShape'> = ({ identifier, series }) => {
  const itemIndex = series.lookupByName.get(identifier.name);
  if (itemIndex === undefined) {
    return '';
  }
  const item = series.data[itemIndex];
  if (!item) {
    return '';
  }
  const label = getLabel(item.label ?? item.name, 'tooltip') ?? item.name;
  return `${label}: ${item.value}`;
};

export default descriptionGetter;
