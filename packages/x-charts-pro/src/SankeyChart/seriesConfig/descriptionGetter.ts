import type { DescriptionGetter } from '@mui/x-charts/internals';

const descriptionGetter: DescriptionGetter<'sankey'> = (params) => {
  const { identifier, series, localeText } = params;

  if (identifier.subType === 'node') {
    const node = series.data.nodes.find((n) => n.id === identifier.nodeId);

    if (!node) {
      return '';
    }

    const value = node.value;

    const formattedValue =
      value !== null
        ? (series.valueFormatter(value, {
            location: 'tooltip',
            type: 'node',
            nodeId: identifier.nodeId,
          }) ?? '')
        : '';

    return localeText.sankeyNodeDescription({
      value,
      formattedValue,
      nodeLabel: node.label,
    });
  }

  const link = series.data.links.find(
    (l) => l.source.id === identifier.sourceId && l.target.id === identifier.targetId,
  );

  if (!link) {
    return '';
  }

  const value = link.value;
  const formattedValue =
    value !== null
      ? (series.valueFormatter(value, {
          location: 'tooltip',
          type: 'link',
          sourceId: identifier.sourceId,
          targetId: identifier.targetId,
        }) ?? '')
      : '';

  return localeText.sankeyLinkDescription({
    value,
    formattedValue,
    sourceLabel: link.source.label,
    targetLabel: link.target.label,
  });
};

export default descriptionGetter;
