---
title: React Funnel chart
productId: x-charts
---

# Charts - Funnel [<span class="plan-pro"></span>](/x/introduction/licensing/#pro-plan 'Pro plan')🚧

<p class="description">Funnel charts allow to express quantity evolution along a process, such as audience engagement, population education levels or yields of multiple processes.</p>

## Basics

The funnel accepts a series which must have a data property containing an array of objects. Those objects should contain a property `value`. They can also have other optional properties, like `label` and `id`.

{{"demo": "BasicFunnel.js"}}

## Styling

### Curve interpolation

The interpolation between data points can be customized by the `curve` property.
This property expects one of the following string values, corresponding to the interpolation method: `'catmullRom'`, `'linear'`, `'monotoneX'`, `'monotoneY'`, `'natural'`, `'step'`, `'stepBefore'`, `'stepAfter'`.

This series property adds the option to control the interpolation of a series.
Different series could even have different interpolations.

{{"demo": "FunnelCurvesNoSnap.js"}}
