# Gestures

A modern and robust multi-pointer gesture detection library for JavaScript and TypeScript applications. It is built on top of the Pointer Events API, and leverages the Event Target API to provide a flexible and extensible framework for detecting user gestures in across all modern browsers.

## Entrypoints

This library is structured into multiple entrypoints to allow for modular usage:

- `@mui/x-internal-gestures/core`: The core gesture detection library
- `@mui/x-internal-gestures/testing`: Utilities for simulating gestures in tests
- `@mui/x-internal-gestures/matchers`: Vitest matchers for testing gestures

### [Core](./src/core/README.md)

The core library for detecting and handling user gestures in web applications. It provides a flexible API for configuring and responding to various gesture interactions including tap, press, move, pan, pinch, rotate, and turn wheel.

### [Testing](./src/testing/README.md))

Utilities for simulating user gestures in browser testing environments. This works alongside `core` to make it easy to test gesture interactions.

### [Matchers](./src/matchers/README.md))

Vitest matchers for testing gestures, making it easier to ensure gesture implementations behave as expected.

## Supported Gestures

The following gestures are supported by the `@mui/x-internal-gestures` library:

- [Tap](./src/core/README.md#tap-gesture) - Detects when a user taps on an element
- [Press](./src/core/README.md#press-gesture) - Detects when a user presses and holds on an element
- [Move](./src/core/README.md#move-gesture) - Detects when a pointer enters, moves within, and leaves an element
- [Pan](./src/core/README.md#pan-gesture) - Detects when a user drags across an element in any direction
- [Pinch](./src/core/README.md#pinch-gesture) - Detects when a user pinches in or out on an element
- [Rotate](./src/core/README.md#rotate-gesture) - Detects when a user rotates pointers around a center point
- [Turn Wheel](./src/core/README.md#turn-wheel-gesture) - Detects mouse wheel events on an element
