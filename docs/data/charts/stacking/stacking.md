---
title: Charts - Stacking
productId: x-charts
---

# Charts - Stacking

<p class="description">Stacking allows displaying the decomposition of values.</p>

## Basics

Bar and line charts allow stacking series.
To stack series together, you need to pass them a `stack` attribute.
Series with the same `stack` value will get stacked together.

{{"demo": "BasicStacking.js"}}

## Stacking strategy

Based on D3 [stack orders](https://github.com/d3/d3-shape#stack-orders) and [stack offsets](https://github.com/d3/d3-shape#stack-offsets) you can modify how series are stacked.

To pass those attributes, use series properties `stackOffset` (default `'diverging'` for bar and `'none'` for line) and `stackOrder` (default `'none'`).
You can define them for only one of the series of a stack group.

### Stack offset

If you just want to stack values, the `stackOffset` set to `'none'` should do the job.

However, with negative values, you should use `'diverging'`.
Otherwise, the stacked rectangle will overlap.

To show series evolution relative to other stacked series (instead of their absolute values), you can use `'expand'`.

| Value         | Description                                               |
| :------------ | :-------------------------------------------------------- |
| `'none'`      | Set baseline at 0 and stack data on top of each other.    |
| `'expand'`    | Set baseline at zero and scale data to end up at 1.       |
| `'diverging'` | Stack positive value above zero and negative value below. |

The next demonstration allows testing the different `stackOffset` values.

To see how they interact with a dataset containing negative values, you can toggle "data has negative values" switch.
When turned on, the series will have the following composition:

- series A has only positive values.
- series B has one negative value.
- series C and D have only negative values.

{{"demo": "StackOffsetDemo.js"}}

### Stack order

The order of stacked data matters for the reading of charts.
The evolution of the series at the bottom is the easiest to read since its baseline is 0.

If you know the data you are displaying, you can use `'none'` which respects the order you defined the series in.
Otherwise, it might be interesting to order them according to their properties.

With `'appearance'`, the position of the maximal series value is taken into consideration.

With `'ascending'` and `'descending'`, the sum of values is taken into consideration.
Which corresponds to the area taken by the series on the chart.

| Value          | Description                                                                                                                               |
| :------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| `'none'`       | Respect the order the series are provided in.                                                                                             |
| `'reverse'`    | Reverse the order the series are provided in.                                                                                             |
| `'appearance'` | Sort series by ascending order according to the index of their maximal value. The series with the earliest maximum will be at the bottom. |
| `'ascending'`  | Sort series by ascending order according to the sum of their values. Series taking the smallest surface will be at the bottom             |
| `'descending'` | Sort series by descending order according to the sum of their values. Series taking the largest surface will be at the bottom             |

To experiment with stack orders, here are statistics about the transport used to go to the office depending on the distance between home and office.

{{"demo": "StackOrderDemo.js"}}

With the `'appearance'` order, **walking** will be the first since its maximal percentage is for **0-1km**. And the last one is **common transportation** because its maximum value is at the **>50km** distance.

With the `'ascending'` order, stacking starts with **bicycles** and **motorbikes** since their values respectively sum to **41.7** and **55.4**.
Then arrives **walking** (with values sum to **94.1**).
Lastly, comes **common transportation** and **cars** which are visually more important.

The `'descending'` order is the strict opposite.
