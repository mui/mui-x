import { getLabel, type DescriptionGetter } from '@mui/x-charts/internals';

const descriptionGetter: DescriptionGetter<'mapShape'> = ({ identifier, series }) => {
  const item = series.data.find((d) => d.name === identifier.dataIndex);
  if (!item) {
    return '';
  }
  const label = getLabel(item.label ?? item.name, 'tooltip') ?? item.name;
  return `${label}: ${item.value}`;
};

export default descriptionGetter;
