# Testing

Utilities for simulating user gestures in browser testing environments.

## Basic Usage

The testing library provides two main user gesture simulators:

- `mouseGesture`: Simulates mouse-based interactions (tap, press, move, pan, wheel)
- `touchGesture`: Simulates touch-based interactions (tap, press, pan, pinch, rotate)

## Advanced Usage

### Testing with Fake Timers

```javascript
import { mouseGesture } from '@mui/x-internal-gestures/testing';
import { vi } from 'vitest';

describe('Gesture with fake timers', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should work with fake timers', async () => {
    const mouse = mouseGesture.setup({
      advanceTimers: async (ms) => {
        await vi.advanceTimersByTimeAsync(ms);
      },
    });

    // Now gestures will use the fake timer
    await mouse.press(element, { duration: 1000 });
  });
});
```

### Testing Gesture Sequences

```javascript
import { touchGesture } from '@mui/x-internal-gestures/testing';

describe('Complex gesture sequence', () => {
  it('should handle a sequence of gestures', async () => {
    const touch = touchGesture.setup();

    // Perform a sequence of gestures
    await touch.tap(element);
    await touch.pan(element, {
      start: { x: 100, y: 100 },
      end: { x: 200, y: 100 },
    });
    await touch.pinch(element, { scale: 1.5 });
    await touch.rotate(element, { angle: 45 });

    // Verify the final state
    // ...
  });
});
```
