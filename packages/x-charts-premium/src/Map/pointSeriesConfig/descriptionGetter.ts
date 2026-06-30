import { getLabel } from '@mui/x-charts/internals';
import type { DescriptionGetter } from '@mui/x-charts/internals';

const descriptionGetter: DescriptionGetter<'mapPoint'> = ({ identifier, series }) => {
  const item = series.data[identifier.dataIndex];
  if (!item) {
    return '';
  }
  const label = getLabel(item.label, 'tooltip');
  const hasValue = item.value != null;
  if (label === undefined) {
    return hasValue ? `${item.value}` : '';
  }
  return hasValue ? `${label}: ${item.value}` : label;
};

export default descriptionGetter;
