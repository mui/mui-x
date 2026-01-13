---
title: Charts - Stacking
productId: x-charts
---

# Charts - Stacking

<p class="description">Display the decomposition of values by stacking series on top of each other.</p>

You can use stacking to display multiple series in a single bar or line, showing how values combine to form a total.

## Implementing stacking

Bar and line charts support stacking.
To stack series together, pass them a `stack` attribute.
Series with the same `stack` value are stacked together.

{{"demo": "BasicStacking.js"}}

## Stacking strategy

You can modify how series are stacked based on D3 [stack orders](https://d3js.org/d3-shape/stack#stack_order) and [stack offsets](https://d3js.org/d3-shape/stack#stack_offset).

To pass these attributes, use the series properties `stackOffset` (default `'diverging'` for bar and `'none'` for line) and `stackOrder` (default `'none'`).
You can define them for only one of the series in a stack group.

### Stack offset

To stack positive values, set `stackOffset` to `'none'`.

When working with negative values, set it to `'diverging'`.
Otherwise, the stacked rectangles will overlap.

To show series evolution relative to other stacked series (instead of their absolute values), you can use `'expand'`.

| Value         | Description                                               |
| :------------ | :-------------------------------------------------------- |
| `'none'`      | Set baseline at 0 and stack data on top of each other.    |
| `'expand'`    | Set baseline at zero and scale data to end up at 1.       |
| `'diverging'` | Stack positive value above zero and negative value below. |

The demo below lets you test the different `stackOffset` values.
To see how they interact with a dataset containing negative values, you can toggle the **data has negative values** switch.
When turned on:

- Series A has only positive values
- Series B has one negative value
- Series C and D have only negative values

{{"demo": "StackOffsetDemo.js"}}

### Stack order

The order of stacked data matters for reading charts.
The evolution of the series at the bottom is the easiest to read since its baseline is 0.

You can control the stack order using the `stackOrder` property on a series.

If you know the data you're displaying, you can set `stackOrder: 'none'`, which respects the order you defined the series in.
Otherwise, you can order them based on different properties of their values as described in the table below:

| Value          | Description                                                                                                                               |
| :------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| `'none'`       | Respect the order the series are provided in.                                                                                             |
| `'reverse'`    | Reverse the order the series are provided in.                                                                                             |
| `'appearance'` | Sort series by ascending order according to the index of their maximal value. The series with the earliest maximum will be at the bottom. |
| `'ascending'`  | Sort series by ascending order according to the sum of their values. Series taking the smallest surface will be at the bottom             |
| `'descending'` | Sort series by descending order according to the sum of their values. Series taking the largest surface will be at the bottom             |

To demonstrate stack order, the example below shows statistics about means of transportation used for commuting to work relative to the distance between home and office for commuters.

{{"demo": "StackOrderDemo.js"}}

With the `'appearance'` order, **walking** is first since its maximal percentage is for **0-1km**, and **common transportation** is last because its maximum value is at the **>50km** distance.

With the `'ascending'` order, stacking starts with **bicycles** and **motorbikes** since their values respectively sum to **41.7** and **55.4**.
Then comes **walking** (with values summing to **94.1**).
Lastly, **common transportation** and **cars** appear, which are visually more important.
The `'descending'` order is the exact opposite.
