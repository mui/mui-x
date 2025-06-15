# Matchers

Vitest matchers for testing gestures.

## Available Matchers

### `toUpdateOptions(expectedOptions: object)`

Asserts that the provided gesture options can be updated by emitting a change event and that the options match the expected values.

```ts
// Check if gesture options can be updated
expect(MoveGesture).toUpdateOptions({ preventDefault: true });
```

### `toBeClonable(overrides?: object)`

Asserts that the provided gesture can be cloned and that the clone has the same properties as the original gesture, or overridden properties if specified.

```ts
// Check if the gesture can be cloned with the same properties
expect(MoveGesture).toBeClonable();

// Check if the gesture can be cloned with overridden properties
expect(MoveGesture).toBeClonable({ preventDefault: true });
```

### `toUpdateState(expectedState: object)`

Asserts that the provided gesture state can be updated by emitting a change event and that the state properties match the expected values.

```ts
// Check if gesture state can be updated
expect(MoveGesture).toUpdateState({ isDragging: true });
```

## Notes

- The matchers `toUpdateOptions`, `toBeClonable`, and `toUpdateState` do not support negation (using `.not` before the matcher). Using these with `.not` will throw an error.
