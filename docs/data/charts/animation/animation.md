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

To customize the animation, you can also use the `useAnimate(props, params)` hook.
It returns a ref and props to pass to the animated element.
Each time the `props` params get updated, the hook creates an interpolation from the previous value to the next one.
On each animation frame, it calls this interpolator to get the intermediate state and applies the result to the animated element.
The attribute update is imperative to bypass the React lifecycle, thus improving performance.
To customize the animation, the `params` allows you to define the following properties:

- `skip`: If `true`, apply the new value immediately;
- `ref`: A ref to merge with the ref returned from this hook;
- `initialProps`: The props used to generate the animation of component creation; if not provided, there will be no initial animation;
- `createInterpolator`: Create an interpolation function from the last to the next props;
- `transformProps`: Optionally transform interpolated props to another format;
- `applyProps`: Apply transformed props to the element.

A more detailed explanation is available in the hook's JSDoc.

In the example below, labels are positioned above the bars they refer to and are animated using the `useAnimation` hook:

{{"demo": "JSAnimationCustomization.js"}}

## Using Animation Libraries

Alternatively, you can use your own animation library to create custom animations, such as React Spring or Motion (Framer Motion).

### Using React Spring

One of the most popular libraries for animations in React is [React Spring](https://www.react-spring.dev/docs/getting-started).
It provides a powerful and flexible API for creating animations, and it works well with the Charts library.

{{"demo": "ReactSpringAnimationCustomization.js"}}

### Using Motion

Another option is the [Motion library](https://motion.dev/docs/react), which provides a declarative API for complex animations with excellent performance.

{{"demo": "MotionAnimationCustomization.js"}}

### Caveats

When using custom animation libraries, you should be aware of the performance implications.
While these libraries can create smooth animations, they may not be optimized for large datasets or complex interactions.

It's essential to test the performance of your charts with the chosen animation library, especially if you are rendering many data points or enabling interactions like zooming or highlighting.
