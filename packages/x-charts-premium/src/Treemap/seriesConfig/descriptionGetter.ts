import type { DescriptionGetter } from '@mui/x-charts/internals';

const descriptionGetter: DescriptionGetter<'treemap'> = (params) => {
  const { identifier, series, localeText } = params;

  const node = series.data.byId.get(identifier.nodeId);
  if (!node) {
    return '';
  }

  const formattedValue =
    series.valueFormatter(node.value, {
      location: 'tooltip',
      nodeId: node.id,
      depth: node.depth,
    }) ?? '';

  return localeText.treemapItemDescription({
    value: node.value,
    formattedValue,
    label: node.label,
  });
};

export default descriptionGetter;
