/**
 * OmitNever is a utility type that omits properties from an object type
 * whose values are of type `never`.
 */
export type OmitNever<T> = { [K in keyof T as T[K] extends never ? never : K]: T[K] };
