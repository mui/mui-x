/* Adapted from https://github.com/mui/base-ui/blob/b6bf1b6b5ff342c829ab2fb5cec2bea07001fb10/packages/react/test/utils.ts#L21 */

// https://stackoverflow.com/questions/53807517/how-to-test-if-two-types-are-exactly-the-same
export type IfEquals<T, U, Y = unknown, N = never> =
  (<G>() => G extends T ? 1 : 2) extends <G>() => G extends U ? 1 : 2 ? Y : N;

/**
 * Issues a type error if `Expected` is not identical to `Actual`.
 *
 * `Expected` should be declared when invoking `expectType`.
 * `Actual` should almost always we be a `typeof value` statement.
 *
 * @example `expectType<number | string, typeof value>(value)`
 * TypeScript issues a type error since `value is not assignable to never`.
 * This means `typeof value` is not identical to `number | string`
 * @param _actual
 */
export function expectType<Expected, Actual>(_actual: IfEquals<Actual, Expected, Actual>): void {}
