import * as React from 'react';
import {
  buildChartExcelWorkbook,
  collectChartExcelTables,
  DEFAULT_CHART_EXCEL_OPTIONS,
  DEFAULT_SHEET_NAMES,
} from '@mui/x-charts-premium/internals';
import type {
  ChartExcelTable,
  ResolvedChartExcelOptions,
} from '@mui/x-charts-premium/internals';

/**
 * Chart data export to Excel, mui/mui-x#14246.
 *
 * The export turns a chart's series into tidy tables: one row per data point, one column
 * per measure, one sheet per column signature. This page feeds the extractors series
 * groups shaped like the ones the chart store holds, so every series type's output can be
 * compared side by side and downloaded as a real .xlsx.
 *
 * The plugin that reads this off a live chart is not built yet, which is why the data here
 * is handed to the extractors directly rather than coming from a rendered chart.
 */

const axis = (data?: unknown[]) => ({ id: 'a', data }) as any;
const noAxis = () => undefined;

const group = (series: Record<string, any>) => ({
  seriesOrder: Object.keys(series),
  series,
});

interface Scenario {
  name: string;
  note: string;
  processedSeries: Record<string, any>;
  getXAxis?: () => any;
  getYAxis?: () => any;
  getRotationAxis?: (id?: string) => any;
}

const sankeyGraph = () => {
  const coal = { id: 'coal', label: 'Coal', value: 42 };
  const grid = { id: 'grid', label: 'Grid', value: 42 };
  const homes = { id: 'homes', label: 'Homes', value: 30 };

  return {
    nodes: [coal, grid, homes],
    links: [
      { source: coal, target: grid, value: 42 },
      { source: grid, target: homes, value: 30 },
    ],
  };
};

const SCENARIOS: Scenario[] = [
  {
    name: 'bar + line',
    note: 'Same column signature, so they merge into one sheet.',
    getXAxis: () => axis(['France', 'Spain', 'Italy']),
    processedSeries: {
      bar: group({
        sales: {
          id: 'sales',
          label: 'Sales',
          data: [68, 47, 59],
          valueFormatter: (v: number | null) => `${v}M EUR`,
        },
      }),
      line: group({
        trend: {
          id: 'trend',
          label: 'Trend',
          data: [60, 50, null],
          // Stacked bounds are present, but the raw values are what gets exported.
          stackedData: [
            [0, 60],
            [0, 50],
            [0, 0],
          ],
          valueFormatter: (v: number | null) => (v === null ? 'n/a' : `${v}M`),
        },
      }),
    },
  },
  {
    name: 'bar, horizontal, with a hidden series',
    note: 'Category comes off the y axis. Hidden series are exported unless the toggle is off.',
    getXAxis: () => axis(['wrong', 'wrong', 'wrong']),
    getYAxis: () => axis(['Q1', 'Q2', 'Q3']),
    processedSeries: {
      bar: group({
        visible: { id: 'visible', label: 'Visible', layout: 'horizontal', data: [1, 2, 3] },
        hiddenOne: {
          id: 'hiddenOne',
          label: 'Hidden',
          layout: 'horizontal',
          hidden: true,
          data: [9, 9, 9],
        },
      }),
    },
  },
  {
    name: 'bar with no axis data',
    note: 'No data, dataKey or valueGetter was given, so the index is the plotted coordinate.',
    getXAxis: () => axis(undefined),
    processedSeries: {
      bar: group({ s: { id: 's', label: 'Raw', data: [10, 20, 30] } }),
    },
  },
  {
    name: 'radar, radialLine, radialBar',
    note: 'Polar and index aligned, so they join the same sheet.',
    getRotationAxis: () => axis(['Speed', 'Range', 'Comfort']),
    processedSeries: {
      radar: group({ carA: { id: 'carA', label: 'Car A', data: [8, 3, 5] } }),
      radialLine: group({ rl: { id: 'rl', label: 'Radial line', data: [1, 2, 3] } }),
      radialBar: group({ rb: { id: 'rb', label: 'Radial bar', data: [4, 5, 6] } }),
    },
  },
  {
    name: 'scatter',
    note: 'Not index aligned. Unequal lengths are not padded, and a point id can be absent.',
    processedSeries: {
      scatter: group({
        a: {
          id: 'a',
          label: 'A',
          data: [
            { x: 1.2, y: 4.5, id: 'p1' },
            { x: 3.4, y: 2.2 },
          ],
          valueFormatter: (p: { x: number; y: number }) => `(${p.x}, ${p.y})`,
        },
        b: { id: 'b', label: 'B', data: [{ x: 9, y: 9, id: 'p3' }] },
      }),
    },
  },
  {
    name: 'scatter with a colour channel',
    note: 'One point defining colorValue anywhere adds the column for the whole table.',
    processedSeries: {
      scatter: group({
        a: { id: 'a', label: 'A', data: [{ x: 1, y: 2 }] },
        b: { id: 'b', label: 'B', data: [{ x: 3, y: 4, colorValue: 7 }] },
      }),
    },
  },
  {
    name: 'pie',
    note: 'Slices carry their own id and label. The third slice is hidden.',
    processedSeries: {
      pie: group({
        p: {
          id: 'p',
          data: [
            { id: 'fr', label: 'France', value: 68, formattedValue: '68M' },
            { id: 'es', label: (l: string) => `Spain (${l})`, value: 47, formattedValue: '47M' },
            { id: 'it', value: 59, formattedValue: '59M', hidden: true },
          ],
        },
      }),
    },
  },
  {
    name: 'funnel',
    note: 'Ordered stages. Polygon geometry on the series is excluded.',
    processedSeries: {
      funnel: group({
        f: {
          id: 'f',
          label: 'Signups',
          data: [
            { id: 'visits', label: 'Visits', value: 1000 },
            { id: 'trials', label: 'Trials', value: 250 },
            { id: 'paid', label: 'Paid', value: 40 },
          ],
          dataPoints: [[{ x: 0, y: 0, useBandWidth: false, stackOffset: 0 }]],
          valueFormatter: (s: { value: number }) => `${s.value} users`,
        },
      }),
    },
  },
  {
    name: 'heatmap',
    note: 'Sparse: a dense 3x2 grid would be 6 rows, only the supplied cells are exported.',
    getXAxis: () => axis(['Jan', 'Feb', 'Mar']),
    getYAxis: () => axis(['Monday', 'Tuesday']),
    processedSeries: {
      heatmap: group({
        h: {
          id: 'h',
          label: 'Visits',
          data: [
            [0, 0, 4],
            [2, 1, 5],
          ],
          valueFormatter: (v: number | null, c: { xIndex: number; yIndex: number }) =>
            `${v} @ ${c.xIndex},${c.yIndex}`,
        },
      }),
    },
  },
  {
    name: 'rangeBar',
    note: 'Start and end, never min and max: the second row is deliberately inverted.',
    getXAxis: () => axis(['Jan', 'Feb', 'Mar']),
    processedSeries: {
      rangeBar: group({
        temp: {
          id: 'temp',
          label: 'Temp',
          data: [[4, 12], [12, 4], null],
          valueFormatter: (v: [number, number] | null) => (v ? `${v[0]} to ${v[1]}` : ''),
        },
      }),
    },
  },
  {
    name: 'ohlc',
    note: 'Four measures on one row, no volume. Dates stay Dates so Excel formats them.',
    getXAxis: () => axis([new Date('2026-01-02'), new Date('2026-01-03')]),
    processedSeries: {
      ohlc: group({
        aapl: {
          id: 'aapl',
          label: 'AAPL',
          data: [[101, 108, 99, 104], null],
          valueFormatter: (v: number | null, c: { field: string }) => `${c.field}=${v}`,
        },
      }),
    },
  },
  {
    name: 'mapShape',
    note: 'Keyed by feature name. A feature with no value still gets a row.',
    processedSeries: {
      mapShape: group({
        pop: {
          id: 'pop',
          label: 'Population',
          data: [
            { name: 'FR-75', label: 'Paris', value: 2100000 },
            { name: 'FR-69', label: 'Rhone', value: 1800000, hidden: true },
            { name: 'FR-2A', label: 'Corse' },
          ],
          valueFormatter: (s: { value?: number }) => `${s.value ?? 0} people`,
        },
      }),
    },
  },
  {
    name: 'sankey',
    note: 'The only type emitting two sheets. Link endpoints are read off the node objects.',
    processedSeries: {
      sankey: group({ flow: { id: 'flow', data: sankeyGraph() } }),
    },
  },
  {
    name: 'bar + scatter',
    note: 'Different signatures, so two sheets rather than a union of columns.',
    getXAxis: () => axis(['France', 'Spain']),
    processedSeries: {
      bar: group({ sales: { id: 'sales', label: 'Sales', data: [68, 47] } }),
      scatter: group({ pts: { id: 'pts', label: 'Points', data: [{ x: 1, y: 2 }] } }),
    },
  },
  {
    name: 'formula injection',
    note: 'Leading =, +, - and @ in text are prefixed unless escaping is turned off.',
    getXAxis: () => axis(['=1+1', '+SUM(A1)', '@cmd', '-danger']),
    processedSeries: {
      bar: group({ s: { id: 's', label: '=EVIL()', data: [1, 2, 3, 4] } }),
    },
  },
];

function tablesFor(scenario: Scenario, options: ResolvedChartExcelOptions): ChartExcelTable[] {
  return collectChartExcelTables({
    processedSeries: scenario.processedSeries as any,
    getXAxis: (scenario.getXAxis ?? noAxis) as any,
    getYAxis: (scenario.getYAxis ?? noAxis) as any,
    getRotationAxis: (scenario.getRotationAxis ?? noAxis) as any,
    getRadiusAxis: noAxis as any,
    options,
  });
}

async function download(tables: ChartExcelTable[], fileName: string, includeHeaders: boolean) {
  const workbook = await buildChartExcelWorkbook(tables, { includeHeaders });

  if (!workbook) {
    return;
  }

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = `${fileName}.xlsx`;
  anchor.click();
  URL.revokeObjectURL(url);
}

const cellText = (value: unknown) => {
  if (value === null || value === undefined) {
    return '';
  }
  if (value instanceof Date) {
    return `${value.toISOString().slice(0, 10)} (Date)`;
  }
  return String(value);
};

function TablePreview({ table }: { table: ChartExcelTable }) {
  return (
    <div style={{ marginTop: 12, overflowX: 'auto' }}>
      <div style={{ fontFamily: 'monospace', fontSize: 12, marginBottom: 4, color: '#444' }}>
        sheet <strong>{DEFAULT_SHEET_NAMES[table.id]}</strong> · {table.rows.length} rows ·{' '}
        {table.columns.length} columns
      </div>
      <table style={{ borderCollapse: 'collapse', fontSize: 12, minWidth: 320 }}>
        <thead>
          <tr>
            {table.columns.map((column) => (
              <th
                key={column.key}
                style={{
                  border: '1px solid #bbb',
                  padding: '2px 8px',
                  textAlign: 'left',
                  background: '#f2f2f2',
                  fontFamily: 'monospace',
                }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => (
            // eslint-disable-next-line react/no-array-index-key
            <tr key={rowIndex}>
              {table.columns.map((column) => (
                <td
                  key={column.key}
                  style={{
                    border: '1px solid #ddd',
                    padding: '2px 8px',
                    fontFamily: 'monospace',
                    color: row[column.key] === null ? '#aaa' : undefined,
                  }}
                >
                  {cellText(row[column.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function App() {
  const [includeFormattedValues, setIncludeFormattedValues] = React.useState(false);
  const [includeHiddenSeries, setIncludeHiddenSeries] = React.useState(
    DEFAULT_CHART_EXCEL_OPTIONS.includeHiddenSeries,
  );
  const [escapeFormulas, setEscapeFormulas] = React.useState(true);
  const [includeHeaders, setIncludeHeaders] = React.useState(true);

  const options: ResolvedChartExcelOptions = React.useMemo(
    () => ({
      ...DEFAULT_CHART_EXCEL_OPTIONS,
      includeFormattedValues,
      includeHiddenSeries,
      escapeFormulas,
    }),
    [includeFormattedValues, includeHiddenSeries, escapeFormulas],
  );

  const results = React.useMemo(
    () => SCENARIOS.map((scenario) => ({ scenario, tables: tablesFor(scenario, options) })),
    [options],
  );

  const allTables = React.useMemo(() => results.flatMap((result) => result.tables), [results]);

  return (
    <div
      style={{
        padding: 24,
        maxWidth: 1100,
        margin: '0 auto',
        colorScheme: 'light',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h1 style={{ marginBottom: 4 }}>Chart data export to Excel</h1>
      <p style={{ marginTop: 0, color: '#555' }}>
        One row per data point, one column per measure, one sheet per column signature. Toggle
        the options to see how each series type changes, then download a real .xlsx.
      </p>

      <div
        style={{
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
          alignItems: 'center',
          padding: 12,
          border: '1px solid #ddd',
          borderRadius: 6,
          margin: '16px 0',
        }}
      >
        {(
          [
            ['includeFormattedValues', includeFormattedValues, setIncludeFormattedValues],
            ['includeHiddenSeries', includeHiddenSeries, setIncludeHiddenSeries],
            ['escapeFormulas', escapeFormulas, setEscapeFormulas],
            ['includeHeaders', includeHeaders, setIncludeHeaders],
          ] as const
        ).map(([label, value, setValue]) => (
          <label key={label} style={{ fontFamily: 'monospace', fontSize: 13 }}>
            <input
              type="checkbox"
              checked={value}
              onChange={(event) => setValue(event.target.checked)}
            />{' '}
            {label}
          </label>
        ))}

        <button type="button" onClick={() => download(allTables, 'chart-data', includeHeaders)}>
          Download every scenario as one .xlsx
        </button>
      </div>

      {results.map(({ scenario, tables }) => (
        <section
          key={scenario.name}
          style={{ borderTop: '1px solid #eee', padding: '16px 0', marginTop: 8 }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
            <h2 style={{ margin: 0, fontSize: 18 }}>{scenario.name}</h2>
            <span style={{ fontSize: 12, color: '#666' }}>
              {tables.length === 1 ? '1 sheet' : `${tables.length} sheets`}
            </span>
            <button
              type="button"
              onClick={() => download(tables, scenario.name.replace(/\W+/g, '-'), includeHeaders)}
            >
              Download .xlsx
            </button>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#555' }}>{scenario.note}</p>

          {tables.length === 0 ? (
            <div style={{ marginTop: 12, fontSize: 12, fontStyle: 'italic', color: '#999' }}>
              No table: nothing to export.
            </div>
          ) : (
            tables.map((table) => <TablePreview key={table.id} table={table} />)
          )}
        </section>
      ))}
    </div>
  );
}
