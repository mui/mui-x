---
product: charts
title: Charts - Bars
---

# Charts - Bars

<p class="description">Bar charts express quantities through a bar's length, using a common baseline.</p>

## Basics

Bar charts series should contain a `data` property containing an array of values.

You can customize bar ticks with the `xAxis`.
This axis might have `scaleType='band'` and its `data` should have the same length as your series.

{{"demo": "BasicBars.js", "bg": "inline"}}

## Stacking

Each bar series can get a `stack` property which expects a string value.
Series with the same `stack` will be stacked on top of each other.

{{"demo": "StackBars.js", "bg": "inline"}}

### Stacking strategy 🚧
