# BarChartProps Interface

<p class="description"></p>

## Import

```js
import { BarChartProps } from '@mui/x-data-grid-pro';
// or
import { BarChartProps } from '@mui/x-data-grid';
```

## Properties

| Name                                                                                            | Type                                                                                | Description                                                        |
| :---------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------- | :----------------------------------------------------------------- |
| <span class="prop-name optional">areaKeys<sup><abbr title="optional">?</abbr></sup></span>      | <span class="prop-type">string[]</span>                                             | The area keys to use when stacking the data.                       |
| <span class="prop-name">children</span>                                                         | <span class="prop-type">ReactNode</span>                                            | The content of the component.                                      |
| <span class="prop-name">data</span>                                                             | <span class="prop-type">ChartData&lt;X, Y&gt;[] \| ChartData&lt;X, Y&gt;[][]</span> | The data to use for the chart.                                     |
| <span class="prop-name optional">fill<sup><abbr title="optional">?</abbr></sup></span>          | <span class="prop-type">string</span>                                               | The fill color to use for the area.                                |
| <span class="prop-name optional">height<sup><abbr title="optional">?</abbr></sup></span>        | <span class="prop-type">number</span>                                               | The height of the chart.                                           |
| <span class="prop-name optional">label<sup><abbr title="optional">?</abbr></sup></span>         | <span class="prop-type">string</span>                                               | The label to display above the chart.                              |
| <span class="prop-name optional">labelColor<sup><abbr title="optional">?</abbr></sup></span>    | <span class="prop-type">string</span>                                               | The color of the label.                                            |
| <span class="prop-name optional">labelFontSize<sup><abbr title="optional">?</abbr></sup></span> | <span class="prop-type">number</span>                                               | The font size of the label.                                        |
| <span class="prop-name optional">margin<sup><abbr title="optional">?</abbr></sup></span>        | <span class="prop-type">Margin</span>                                               | The margin to use.<br />Labels and axes fall within these margins. |
| <span class="prop-name optional">pixelsPerTick<sup><abbr title="optional">?</abbr></sup></span> | <span class="prop-type">number</span>                                               | The maximum number of pixels per tick.                             |
| <span class="prop-name optional">seriesLabels<sup><abbr title="optional">?</abbr></sup></span>  | <span class="prop-type">string[]</span>                                             | The series labels. Used in the tooltip.                            |
| <span class="prop-name optional">stacked<sup><abbr title="optional">?</abbr></sup></span>       | <span class="prop-type">boolean</span>                                              | If `true`, the data will be stacked.                               |
| <span class="prop-name optional">xDomain<sup><abbr title="optional">?</abbr></sup></span>       | <span class="prop-type">string[]</span>                                             | Override the calculated domain of the x axis.                      |
| <span class="prop-name optional">xKey<sup><abbr title="optional">?</abbr></sup></span>          | <span class="prop-type">string</span>                                               | The key to use for the x axis.                                     |
| <span class="prop-name optional">xScaleType<sup><abbr title="optional">?</abbr></sup></span>    | <span class="prop-type">linear \| time \| log \| point \| pow \| sqrt \| utc</span> | The scale type to use for the x axis.                              |
| <span class="prop-name optional">yDomain<sup><abbr title="optional">?</abbr></sup></span>       | <span class="prop-type">string[]</span>                                             | Override the calculated domain of the y axis.                      |
| <span class="prop-name optional">yKey<sup><abbr title="optional">?</abbr></sup></span>          | <span class="prop-type">string</span>                                               | The key to use for the y axis.                                     |
| <span class="prop-name optional">yScaleType<sup><abbr title="optional">?</abbr></sup></span>    | <span class="prop-type">linear \| time \| log \| point \| pow \| sqrt \| utc</span> | The scale type to use for the y axis.                              |
