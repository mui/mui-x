import type { ChartExcelColumn, ChartExcelTable } from '../chartExcelData.types';
import { toCell, toSafeCell } from '../cell';
import type { ChartExcelExtractor } from './types';
import { withFormattedValueColumn } from './utils';

const NODE_COLUMNS: ChartExcelColumn[] = [
  { key: 'series', header: 'series' },
  { key: 'id', header: 'id' },
  { key: 'label', header: 'label' },
  { key: 'value', header: 'value' },
];

const LINK_COLUMNS: ChartExcelColumn[] = [
  { key: 'series', header: 'series' },
  { key: 'source', header: 'source' },
  { key: 'target', header: 'target' },
  { key: 'value', header: 'value' },
];

/**
 * Sankey is a graph, so it has no one-row-per-point form and is the only series type
 * emitting two tables: its nodes and its links.
 *
 * After defaultizing, d3-sankey has replaced the link `source` and `target` ids with
 * references to the node objects, so the ids have to be read back off those.
 *
 * The sankey series has no `label` prop, so the `series` column is always the series id.
 */
export const sankeyExtractor: ChartExcelExtractor<'sankey'> = (params) => {
  const { seriesOrder, series, options } = params;
  const { escapeFormulas, includeFormattedValues } = options;

  const nodeRows: ChartExcelTable['rows'] = [];
  const linkRows: ChartExcelTable['rows'] = [];

  for (const seriesId of seriesOrder) {
    const item = series[seriesId];

    if (!item) {
      continue;
    }

    const seriesLabel = toSafeCell(String(item.id), escapeFormulas);

    for (const node of item.data.nodes) {
      const row: ChartExcelTable['rows'][number] = {
        series: seriesLabel,
        id: toSafeCell(node.id, escapeFormulas),
        label: toSafeCell(node.label, escapeFormulas),
        value: toCell(node.value),
      };

      if (includeFormattedValues) {
        row.formattedValue = toSafeCell(
          item.valueFormatter?.(node.value, {
            location: 'tooltip',
            type: 'node',
            nodeId: node.id,
          }),
          escapeFormulas,
        );
      }

      nodeRows.push(row);
    }

    for (const link of item.data.links) {
      const row: ChartExcelTable['rows'][number] = {
        series: seriesLabel,
        source: toSafeCell(link.source.id, escapeFormulas),
        target: toSafeCell(link.target.id, escapeFormulas),
        value: toCell(link.value),
      };

      if (includeFormattedValues) {
        row.formattedValue = toSafeCell(
          item.valueFormatter?.(link.value, {
            location: 'tooltip',
            type: 'link',
            sourceId: link.source.id,
            targetId: link.target.id,
          }),
          escapeFormulas,
        );
      }

      linkRows.push(row);
    }
  }

  const tables: ChartExcelTable[] = [];

  if (nodeRows.length > 0) {
    tables.push({
      id: 'sankeyNodes',
      columns: includeFormattedValues
        ? withFormattedValueColumn(NODE_COLUMNS, 'value')
        : NODE_COLUMNS,
      rows: nodeRows,
    });
  }

  if (linkRows.length > 0) {
    tables.push({
      id: 'sankeyLinks',
      columns: includeFormattedValues
        ? withFormattedValueColumn(LINK_COLUMNS, 'value')
        : LINK_COLUMNS,
      rows: linkRows,
    });
  }

  return tables;
};
