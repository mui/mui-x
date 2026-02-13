---
title: React Candlestick chart
productId: x-charts
components: CandlestickChart, CandlestickPlot
---

# Charts - Candlestick [<span class="plan-premium"></span>](/x/introduction/licensing/#premium-plan 'Premium plan')

<p class="description">A candlestick chart is used to visualize price movement over time.</p>

## Overview

A candlestick chart provides a visual overview of how a price changes over time, commonly used in financial contexts like stock market analysis.

Each candlestick represents a time period and shows where the price started, where it ended, and how high or low it moved during that period.

This makes it easier to understand overall trends, compare price movements, and see how buying and selling activity evolves.

## Basics

{{"demo": "BasicCandlestick.js"}}

## Composition

Similar to other chart types, candlestick charts can be composed using multiple components to create more complex visualizations.

In this example, we demonstrate how to create a candlestick chart that displays the volume of trades as a bar chart, as well as the 20-day moving average, shown as a line chart.

{{"demo": "CandlestickComposition.js"}}

Since the candlestick plot is a WebGL canvas, you need to render it inside a `ChartsWebGlLayer`. You can read more about layering in the [Layering](/x/react-charts/composition/#layering) documentation.