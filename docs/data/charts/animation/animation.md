---
title: Charts - Animation
productId: x-charts
---

# Charts - Animation

<p class="description">Learn how to customize both CSS and JavaScript-based Chart animations.</p>

Some elements of the MUI X Charts are animated by default.
For example, the bars in a Bar Chart rise from the axis, and the slices in a Pie Chart expand to fill the circle.

These animations are primarily built with CSS, but some use JavaScript-based React hooks as well.
You can use these hooks to animate other elements of the Charts that aren't animated by default, or to add animations to your own custom components.

To customize Chart animations, you may need to override CSS classes or implement the custom hooks provided, depending on your specific use case.

## Customizing CSS animations

You can override the default CSS classes to customize CSS-based animations.
The demo below shows how you can increase the label's animation duration to two seconds:

{{"demo": "CSSAnimationCustomization.js"}}

## Customizing JavaScript animations

To override JavaScript-based animations—or to use the Chart animations in custom components—you can use the custom animation hooks.

The Charts package provides the following animation hooks:

- `useAnimateArea()`
- `useAnimateBar()`
- `useAnimateBarLabel()`
- `useAnimateLine()`
- `useAnimatePieArc()`
- `useAnimatePieArcLabel()`

The demo below illustrates how to use these hooks by animating the bar labels to match the bar animation—click **Run Animation** to see it in action:

{{"demo": "JSDefaultAnimation.js"}}

### The useAnimate() hook

For more fine-grained animation customization, you can use the `useAnimate(props, params)` hook.
This hook returns a ref as well as props to pass to the animated element.
Each time the `props` params are updated, the hook creates an interpolation from the previous value to the next one.
As each animation frame loads, it calls this interpolator to get the intermediate state and applies the result to the animated element.
(The attribute update is imperative to bypass the React lifecycle for improved performance.)

With `params` you can define the following properties:

- `skip`: If `true`, apply the new value immediately
- `ref`: A ref to merge with the ref returned from this hook
- `initialProps`: The props used to generate the animation of component creation; if none are provided, there is no initial animation
- `createInterpolator`: Create an interpolation function from the last to the next props
- `transformProps`: Optionally transform interpolated props to another format
- `applyProps`: Apply transformed props to the element

You can find more detailed explanations in the hook's JSDoc.

In the example below, labels are positioned above the bars they refer to and are animated with the `useAnimate()` hook:

{{"demo": "JSAnimationCustomization.js"}}

## Third-party animation libraries

You can fully override the default Chart animations with your own (third-party) animation library.

:::warning
Third-party JavaScript animation libraries can cause performance issues, especially if you're rendering many data points or enabling interactions like zooming or highlighting.
It's essential to test the performance of your charts with your chosen animation library.
:::

### React Spring

The demo below shows how to integrate [React Spring](https://www.react-spring.dev/docs/getting-started) to add a bounce effect to the bar label animation:

{{"demo": "ReactSpringAnimationCustomization.js"}}

### Motion

The following demo uses the [Motion library](https://motion.dev/docs/react) for a fade-in effect on the points and lines in the chart:

{{"demo": "MotionAnimationCustomization.js"}}
