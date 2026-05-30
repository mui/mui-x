/**
 * Grid configuration shared between the inline Data Grid rendered by
 * `<DataStudio>` and the registry-rendered views that also need the
 * server-side aggregation / pivoting strategy (e.g. the built-in pivot view).
 *
 * Keeping these in one place ensures a pivot Sheet aggregates and lays out
 * generated columns exactly like the inline preview grid does.
 */

/**
 * Server-side aggregation functions advertised to DataGridPremium. The grid
 * forwards the chosen function name to the Data Source connector
 * (`getAggregatedValue`); the empty descriptors just register the names.
 */
export const DATA_STUDIO_SERVER_AGGREGATION_FUNCTIONS = {
  sum: {},
  avg: {},
  min: {},
  max: {},
  size: {},
  sizeTrue: {},
  sizeFalse: {},
};

/**
 * Separator joining a pivot column group path into a single generated column
 * field. Chosen to avoid colliding with real field names.
 */
export const DATA_STUDIO_PIVOT_FIELD_SEPARATOR = '>->';

/**
 * Class applied to generated pivot value/measure header cells so they render
 * the aggregation label on a single line (`nowrap` + ellipsis) instead of
 * wrapping to a ragged two-line stack. Styled by the pivot/chart view wrappers.
 */
export const DATA_STUDIO_PIVOT_MEASURE_HEADER_CLASS = 'DataStudioPivotMeasureHeader';

/**
 * Class applied to generated pivot value/measure cells (and their footer total)
 * so aggregated numbers render with tabular figures and align in one optical
 * column. Styled by the pivot/chart view wrappers.
 */
export const DATA_STUDIO_PIVOT_MEASURE_CELL_CLASS = 'DataStudioPivotMeasureCell';

/**
 * Build the generated pivot column definition for DataGridPremium server-side
 * pivoting: the column group path joined with the original field. Also pins a
 * sensible `minWidth`, left-aligns the header, and tags the header/cells so the
 * aggregation label stays single-line and the numbers render tabular-aligned.
 * @param {string} originalColumnField The source column field used as a pivot value.
 * @param {string[]} columnGroupPath The server pivot column group path.
 * @returns {object} The generated pivot column definition.
 */
export function getDataStudioPivotingColDef(
  originalColumnField: string,
  columnGroupPath: string[],
) {
  return {
    field: columnGroupPath.concat(originalColumnField).join(DATA_STUDIO_PIVOT_FIELD_SEPARATOR),
    // Hold the aggregation label (e.g. `Units (sum)`) on one line; the neighbor
    // headers are single-line so the measure header must be too.
    minWidth: 100,
    headerAlign: 'left' as const,
    headerClassName: DATA_STUDIO_PIVOT_MEASURE_HEADER_CLASS,
    cellClassName: DATA_STUDIO_PIVOT_MEASURE_CELL_CLASS,
  };
}
