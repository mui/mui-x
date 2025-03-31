---
title: Charts - Animation
productId: x-charts
---

# Charts - Animation

<p class="description">Animate charts for a better look and feel.</p>

Some elements of charts are animated, such as the bars in a bar chart or the slices in a pie chart.

Charts use CSS animations when possible, but some animations can't be done using CSS only. In those cases, JavaScript is used to animate elements.

The animations of elements that are animated using CSS can be customized by overriding the CSS classes:

{{"demo": "CSSAnimationCustomization.js"}}

When it isn't possible to leverage CSS animations, the default components are animated using custom hooks.

If you want to use the default animations in custom components, you can use these hooks.
They are available for each element that is animated using JavaScript and are prefixed with `useAnimate`.
The following hooks are available:

- `useAnimateArea`;
- `useAnimateBar`;
- `useAnimateBarLabel`;
- `useAnimateLine`;
- `useAnimatePieArc`;
- `useAnimatePieArcLabel`.

{{"demo": "JSDefaultAnimation.js"}}

You can also use the `useAnimate` hook, in case you want to customize the default animations.
In the example below, labels are positioned above the bars they refer to and are animated using the `useAnimation` hook:

{{"demo": "JSAnimationCustomization.js"}}

Alternatively, you can use your own animation library to create custom animations, such as React Spring:

{{"demo": "ReactSpringAnimationCustomization.js"}}

Note that sometimes JavaScript animation libraries cause performance issues, especially when rendering many data points or when interactions are enabled (e.g., zoom, highlight).
