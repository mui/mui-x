# Core

This package provides a configurable and extensible API for detecting and handling user gestures in web applications. It supports a wide range of gesture types including tap, press, move, pan, pinch, rotate, and wheel gestures.

## Basic Usage

```javascript
import { GestureManager, TapGesture, PanGesture } from '@mui/x-internal-gestures/core';

// Initialize gesture manager with pre-configured gestures
const gestureManager = new GestureManager({
  gestures: [
    new TapGesture({
      // Required name, it is used to generate the event names
      name: 'tap',
    }),
    new PanGesture({
      name: 'pan',
    }),
  ],
});

// Register elements for gestures - return value is an element with typed event listeners
const target = gestureManager.registerElement(
  ['tap', 'pan'], // Gestures to enable
  document.getElementById('gesture-target'),
);

// Add event listeners with properly typed event data
target.addEventListener('tap', (event) => {
  const detail = event.detail;
  console.log(`Tap at: x=${detail.x}, y=${detail.y}`);
});

target.addEventListener('panStart', (event) => {
  console.log('Pan started', event.detail.centroid);
});

target.addEventListener('pan', (event) => {
  // Update element position based on pan
  const targetX = event.detail.totalDeltaX;
  const targetY = event.detail.totalDeltaY;
  target.style.transform = `translate(${targetX}px, ${targetY}px)`;
});
```

## Supported Gestures

### Tap Gesture

Detects when a user taps on an element. Configurable for number of taps and pointers required.

```javascript
import { TapGesture } from '@mui/x-internal-gestures/core';

const tapGesture = new TapGesture({
  name: 'tap',
});

tapGesture.addEventListener('tap', (event) => console.log(event.detail));
```

#### Tap Gesture Options

| Option            | Type       | Required | Default    | Description                                                              |
| :---------------- | :--------- | :------- | :--------- | :----------------------------------------------------------------------- |
| `name`            | `string`   | ✓        | -          | Unique name for the gesture instance                                     |
| `minPointers`     | `number`   |          | `1`        | Minimum number of pointers required                                      |
| `maxPointers`     | `number`   |          | `Infinity` | Maximum number of pointers allowed                                       |
| `maxDistance`     | `number`   |          | `10`       | Maximum distance in pixels the pointer can move for it to still be a tap |
| `taps`            | `number`   |          | `1`        | Number of consecutive taps required (1 for single tap, 2 for double tap) |
| `preventDefault`  | `boolean`  |          | `false`    | Prevent default browser behavior                                         |
| `stopPropagation` | `boolean`  |          | `false`    | Stop event propagation                                                   |
| `preventIf`       | `string[]` |          | `[]`       | Gesture names that should prevent this gesture                           |

### Press Gesture

Detects when a user presses and holds on an element for a specified duration.

```javascript
import { PressGesture } from '@mui/x-internal-gestures/core';

const pressGesture = new PressGesture({
  name: 'press',
});

pressGesture.addEventListener('pressStart', (event) => console.log(event.detail));
pressGesture.addEventListener('press', (event) => console.log(event.detail));
pressGesture.addEventListener('pressEnd', (event) => console.log(event.detail));
```

#### Press Gesture Options

| Option            | Type       | Required | Default | Description                                    |
| :---------------- | :--------- | :------- | :------ | :--------------------------------------------- |
| `name`            | `string`   | ✓        | -       | Unique name for the gesture instance           |
| `minPointers`     | `number`   |          | `1`     | Minimum number of pointers required            |
| `maxPointers`     | `number`   |          | `1`     | Maximum number of pointers allowed             |
| `duration`        | `number`   |          | `500`   | Time required to hold in milliseconds          |
| `maxDistance`     | `number`   |          | `10`    | Maximum distance pointer can move during press |
| `preventDefault`  | `boolean`  |          | `false` | Prevent default browser behavior               |
| `stopPropagation` | `boolean`  |          | `false` | Stop event propagation                         |
| `preventIf`       | `string[]` |          | `[]`    | Gesture names that should prevent this gesture |

### Move Gesture

Detects when a pointer enters, moves within, and leaves an element. This gesture doesn't work with touch pointers.

```javascript
import { MoveGesture } from '@mui/x-internal-gestures/core';

const moveGesture = new MoveGesture({
  name: 'move',
});

moveGesture.addEventListener('moveStart', (event) => console.log(event.detail));
moveGesture.addEventListener('move', (event) => console.log(event.detail));
moveGesture.addEventListener('moveEnd', (event) => console.log(event.detail));
```

#### Move Gesture Options

| Option            | Type       | Required | Default | Description                                           |
| :---------------- | :--------- | :------- | :------ | :---------------------------------------------------- |
| `name`            | `string`   | ✓        | -       | Unique name for the gesture instance                  |
| `minPointers`     | `number`   |          | `1`     | Minimum number of pointers required                   |
| `maxPointers`     | `number`   |          | `1`     | Maximum number of pointers allowed                    |
| `threshold`       | `number`   |          | `0`     | Movement threshold in pixels before gesture activates |
| `preventDefault`  | `boolean`  |          | `false` | Prevent default browser behavior                      |
| `stopPropagation` | `boolean`  |          | `false` | Stop event propagation                                |
| `preventIf`       | `string[]` |          | `[]`    | Gesture names that should prevent this gesture        |

### Pan Gesture

Detects when a user drags across an element in any direction.

```javascript
import { PanGesture } from '@mui/x-internal-gestures/core';

const panGesture = new PanGesture({
  name: 'pan',
});

panGesture.addEventListener('panStart', (event) => console.log(event.detail));
panGesture.addEventListener('pan', (event) => console.log(event.detail));
panGesture.addEventListener('panEnd', (event) => console.log(event.detail));
panGesture.addEventListener('panCancel', (event) => console.log(event.detail));
```

#### Pan Gesture Options

| Option            | Type       | Required | Default                           | Description                                           |
| :---------------- | :--------- | :------- | :-------------------------------- | :---------------------------------------------------- |
| `name`            | `string`   | ✓        | -                                 | Unique name for the gesture instance                  |
| `minPointers`     | `number`   |          | `1`                               | Minimum number of pointers required                   |
| `maxPointers`     | `number`   |          | `Infinity`                        | Maximum number of pointers allowed                    |
| `threshold`       | `number`   |          | `10`                              | Movement threshold in pixels before gesture activates |
| `direction`       | `string[]` |          | `['up', 'down', 'left', 'right']` | Allowed pan directions                                |
| `preventDefault`  | `boolean`  |          | `false`                           | Prevent default browser behavior                      |
| `stopPropagation` | `boolean`  |          | `false`                           | Stop event propagation                                |
| `preventIf`       | `string[]` |          | `[]`                              | Gesture names that should prevent this gesture        |

### Pinch Gesture

Detects when a user pinches in or out on an element using two or more pointers.

```javascript
import { PinchGesture } from '@mui/x-internal-gestures/core';

const pinchGesture = new PinchGesture({
  name: 'pinch',
});

pinchGesture.addEventListener('pinchStart', (event) => console.log(event.detail));
pinchGesture.addEventListener('pinch', (event) => console.log(event.detail));
pinchGesture.addEventListener('pinchEnd', (event) => console.log(event.detail));
pinchGesture.addEventListener('pinchCancel', (event) => console.log(event.detail));
```

#### Pinch Gesture Options

| Option            | Type       | Required | Default    | Description                                           |
| :---------------- | :--------- | :------- | :--------- | :---------------------------------------------------- |
| `name`            | `string`   | ✓        | -          | Unique name for the gesture instance                  |
| `minPointers`     | `number`   |          | `2`        | Minimum number of pointers required                   |
| `maxPointers`     | `number`   |          | `Infinity` | Maximum number of pointers allowed                    |
| `threshold`       | `number`   |          | `2`        | Movement threshold in pixels before gesture activates |
| `preventDefault`  | `boolean`  |          | `false`    | Prevent default browser behavior                      |
| `stopPropagation` | `boolean`  |          | `false`    | Stop event propagation                                |
| `preventIf`       | `string[]` |          | `[]`       | Gesture names that should prevent this gesture        |

### Rotate Gesture

Detects when a user rotates pointers around a center point.

```javascript
import { RotateGesture } from '@mui/x-internal-gestures/core';

const rotateGesture = new RotateGesture({
  name: 'rotate',
});

rotateGesture.addEventListener('rotateStart', (event) => console.log(event.detail));
rotateGesture.addEventListener('rotate', (event) => console.log(event.detail));
rotateGesture.addEventListener('rotateEnd', (event) => console.log(event.detail));
rotateGesture.addEventListener('rotateCancel', (event) => console.log(event.detail));
```

#### Rotate Gesture Options

| Option            | Type       | Required | Default    | Description                                    |
| :---------------- | :--------- | :------- | :--------- | :--------------------------------------------- |
| `name`            | `string`   | ✓        | -          | Unique name for the gesture instance           |
| `minPointers`     | `number`   |          | `2`        | Minimum number of pointers required            |
| `maxPointers`     | `number`   |          | `Infinity` | Maximum number of pointers allowed             |
| `preventDefault`  | `boolean`  |          | `false`    | Prevent default browser behavior               |
| `stopPropagation` | `boolean`  |          | `false`    | Stop event propagation                         |
| `preventIf`       | `string[]` |          | `[]`       | Gesture names that should prevent this gesture |

### Turn Wheel Gesture

Detects mouse wheel events on an element.

```javascript
import { TurnWheelGesture } from '@mui/x-internal-gestures/core';

const turnWheelGesture = new TurnWheelGesture({
  name: 'turnWheel',
});

turnWheelGesture.addEventListener('turnWheel', (event) => console.log(event.detail));
```

#### Turn Wheel Gesture Options

| Option            | Type       | Required | Default                   | Description                                    |
| :---------------- | :--------- | :------- | :------------------------ | :--------------------------------------------- |
| `name`            | `string`   | ✓        | -                         | Unique name for the gesture instance           |
| `sensitivity`     | `number`   |          | `1`                       | Sensitivity multiplier for wheel events        |
| `max`             | `number`   |          | `Number.MAX_SAFE_INTEGER` | Maximum value for accumulated deltas           |
| `min`             | `number`   |          | `Number.MIN_SAFE_INTEGER` | Minimum value for accumulated deltas           |
| `initialDelta`    | `number`   |          | `0`                       | Initial value for totalDelta values            |
| `invert`          | `boolean`  |          | `false`                   | Invert the direction of delta changes          |
| `preventDefault`  | `boolean`  |          | `false`                   | Prevent default browser behavior               |
| `stopPropagation` | `boolean`  |          | `false`                   | Stop event propagation                         |
| `preventIf`       | `string[]` |          | `[]`                      | Gesture names that should prevent this gesture |

## Advanced Usage

### Combining Multiple Gestures

```javascript
// Add multiple gestures to the same element
const target = gestureManager.registerElement(['pan', 'pinch', 'rotate'], element);

// Handle multiple gesture events
target.addEventListener('pinch', (event) => {
  const scale = event.detail.totalScale;
  // Update scale transform
});

target.addEventListener('rotate', (event) => {
  const rotation = event.detail.totalRotation;
  // Update rotation transform
});

target.addEventListener('pan', (event) => {
  const tx = event.detail.totalDeltaX;
  const ty = event.detail.totalDeltaY;
  // Update position transform
});

// Combined transform example
function updateElementTransform(el, { scale, rotation, translateX, translateY }) {
  const transform = `translate(${translateX}px, ${translateY}px) rotate(${rotation}deg) scale(${scale})`;
  el.style.transform = transform;
}
```

### Gesture Conflict Resolution

You can specify which gestures should take precedence:

```javascript
import { GestureManager, PanGesture, PinchGesture } from '@mui/x-internal-gestures/core';

const gestureManager = new GestureManager({
  gestures: [
    new PanGesture({
      name: 'pan',
      preventIf: ['pinch'],
    }),
    new PinchGesture({
      name: 'pinch',
    }),
  ],
});
```
