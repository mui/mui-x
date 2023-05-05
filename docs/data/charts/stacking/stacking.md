---
product: charts
title: Charts - Stacking
---

# Charts - Stacking

<p class="description">Stacking allows to display the decomposition of values.</p>

## Basics

Bar and line charts allow staking series.
To stack series together, you need to pass them a `stack` attributes.
Series with the same `stack` value will get stacked together.

{{"demo": "BasicStacking.js"}}

## Stacking strategy

Based on D3 [stack orders](https://github.com/d3/d3-shape#stack-orders) and [stack offsets](https://github.com/d3/d3-shape#stack-offsets) you can modify how series are stacked.

To pass those attributes, use series properties `stackOffset` (default `'diverging'`) and `stackOrder` (default `'none'`) which accept a string.
You can define them for only one of the series of a stack group.

### Stack offset

If you just want to stack values, the `stackOffset` set to `'none'` should do the job.
However, with negative values, you should use `'diverging'`.
Otherwise, stacked rectangle will overlap.

To show relative evolution instead of absolute values, you can use `'expand'`.

| value         | description                                               |
| :------------ | :-------------------------------------------------------- |
| `'none'`      | Set baseline at 0 and stack data on top of each other.    |
| `'expand'`    | Set baseline at zero and scale data to en up at 1.        |
| `'diverging'` | Stack positive value above zero and negative value below. |

The next demonstration allows to test the different `stackOffset` values.

To see how they interact with dataset containing negative values, you can toggle "data has negative values".
When turned on, the series will be such that

- series A has only positive values.
- series B has one negative value.
- series C and D have only negative values.

{{"demo": "StackOffsetDemo.js"}}

### Stack order

The order of stacked data matters for the reading of charts.
The evolution of the series ate the bottom is the easiest to read since its baseline is 0.

If you know the data to display, you can use `'none'` which respect the order you defined series.
Otherwise, if might be interesting to order them according to their properties.

With `'appearance'` you take into consideration the position of series maximal value.

With `'ascending'` and `'descending'` you take into consideration, the sum of values.
Which correspond the the area taken by the series on the chart.

| value          | description                                                                                                                              |
| :------------- | :--------------------------------------------------------------------------------------------------------------------------------------- |
| `'none'`       | Respect the order series are provided                                                                                                    |
| `'reverse'`    | Reverse the order series are provided                                                                                                    |
| `'appearance'` | Sort series by ascending order according to the index of their maximal value. The series with the earlies maximum will be at the bottom. |
| `'ascending'`  | Sort series by ascending order according to the sum of their values. Series taking the smallest surface is at the bottom                 |
| `'descending'` | Sort series by descending order according to the sum of their values. Series taking the largest surface is at the bottom                 |
