/**
 * Ensures that a `name` is a valid identifier belonging to a `T` type.
 */
export const nameof = <T>(name: keyof T) => name;
