"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useChartProApiRef = void 0;
var React = require("react");
/**
 * Hook that instantiates a [[ChartProApiRef]].
 * The chart type needs to be given as the generic parameter to narrow down the API to the specific chart type.
 * @example
 * ```tsx
 * const barApiRef = useChartProApiRef<'bar'>();
 * ```
 * @example
 * ```tsx
 * // The API can be passed to the chart component and used to interact with the chart.
 * <BarChart apiRef={barApiRef} />
 * ```
 * @example
 * ```tsx
 * // The API can be used to access chart methods and properties.
 * barApiRef.current?.getSeries();
 * ```
 */
var useChartProApiRef = function () { return React.useRef(undefined); };
exports.useChartProApiRef = useChartProApiRef;
