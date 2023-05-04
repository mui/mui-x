---
product: charts
title: Charts - Bars
---

# Charts - Bars

<p class="description">Bar charts express quantities through a bar's length, using a common baseline.</p>

## Basics

Bar charts series should contain a property `data` containing an array of values.

You can customize bar ticks with the `xAxis`.
This axis might have `scaleType='band'` and its `data` should have the same length, than your series.

{{"demo": "BasicBars.js", "bg": "inline"}}

## Stacking

Each bar series can get a property `stack` which expect a string value.
Series with the same `stack` will be staked on each other.

{{"demo": "StackBars.js", "bg": "inline"}}

### Stacking strategy 🚧
