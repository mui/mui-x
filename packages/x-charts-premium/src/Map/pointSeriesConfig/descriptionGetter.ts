import { getLabel } from '@mui/x-charts/internals';
import type { DescriptionGetter } from '@mui/x-charts/internals';

const descriptionGetter: DescriptionGetter<'mapPoint'> = ({ identifier, series }) => {
  const item = series.data[identifier.dataIndex];
  if (!item) {
    return '';
  }
  const label = getLabel(item.label, 'tooltip');
  if (label === undefined) {
    return `${item.value}`;
  }
  return `${label}: ${item.value}`;
};

export default descriptionGetter;
