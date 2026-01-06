---
title: Charts - Stacking
productId: x-charts
---

# Charts - Stacking

<p class="description">Display the decomposition of values by stacking series on top of each other.</p>

You can use stacking to display multiple series in a single bar or line, showing how values combine to form a total.

## Basics

Bar and line charts support stacking.
To stack series together, pass them a `stack` attribute.
Series with the same `stack` value will be stacked together.

{{"demo": "BasicStacking.js"}}

## Stacking strategy

You can modify how series are stacked based on D3 [stack orders](https://d3js.org/d3-shape/stack#stack_order) and [stack offsets](https://d3js.org/d3-shape/stack#stack_offset).

To pass these attributes, use the series properties `stackOffset` (default `'diverging'` for bar and `'none'` for line) and `stackOrder` (default `'none'`).
You can define them for only one of the series in a stack group.

### Stack offset

If you want to stack values, set `stackOffset` to `'none'`.

However, with negative values, you should use `'diverging'`.
Otherwise, the stacked rectangles will overlap.

To show series evolution relative to other stacked series (instead of their absolute values), you can use `'expand'`.

| Value         | Description                                               |
| :------------ | :-------------------------------------------------------- |
| `'none'`      | Set baseline at 0 and stack data on top of each other.    |
| `'expand'`    | Set baseline at zero and scale data to end up at 1.       |
| `'diverging'` | Stack positive value above zero and negative value below. |

The demo below lets you test the different `stackOffset` values.

To see how they interact with a dataset containing negative values, you can toggle the "data has negative values" switch.
When turned on, the series will have the following composition:

- Series A has only positive values
- Series B has one negative value
- Series C and D have only negative values

{{"demo": "StackOffsetDemo.js"}}

### Stack order

The order of stacked data matters for reading charts.
The evolution of the series at the bottom is the easiest to read since its baseline is 0.

If you know the data you're displaying, you can use `'none'`, which respects the order you defined the series in.
Otherwise, you might want to order them according to their properties.

With `'appearance'`, the position of the maximal series value is taken into consideration.

With `'ascending'` and `'descending'`, the sum of values is taken into consideration.
This corresponds to the area taken by the series on the chart.

| Value          | Description                                                                                                                               |
| :------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| `'none'`       | Respect the order the series are provided in.                                                                                             |
| `'reverse'`    | Reverse the order the series are provided in.                                                                                             |
| `'appearance'` | Sort series by ascending order according to the index of their maximal value. The series with the earliest maximum will be at the bottom. |
| `'ascending'`  | Sort series by ascending order according to the sum of their values. Series taking the smallest surface will be at the bottom             |
| `'descending'` | Sort series by descending order according to the sum of their values. Series taking the largest surface will be at the bottom             |

To experiment with stack orders, the demo below shows statistics about transportation used to go to the office depending on the distance between home and office.

{{"demo": "StackOrderDemo.js"}}

With the `'appearance'` order, **walking** will be first since its maximal percentage is for **0-1km**, and **common transportation** will be last because its maximum value is at the **>50km** distance.

With the `'ascending'` order, stacking starts with **bicycles** and **motorbikes** since their values respectively sum to **41.7** and **55.4**.
Then comes **walking** (with values summing to **94.1**).
Lastly, **common transportation** and **cars** appear, which are visually more important.

The `'descending'` order is the strict opposite.
