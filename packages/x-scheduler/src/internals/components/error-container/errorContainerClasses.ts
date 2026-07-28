export interface ErrorContainerClasses {
  /** Styles applied to the error container element. */
  errorContainer: string;
  /** Styles applied to the error alert element. */
  errorAlert: string;
  /** Styles applied to the error message element. */
  errorMessage: string;
}

export type ErrorContainerClassKey = keyof ErrorContainerClasses;

// Shared so every product that hosts the `ErrorContainer` derives the same keys.
// A rename here breaks the build in every product instead of silently dropping a CSS class.
export const errorContainerClassKeys: ErrorContainerClassKey[] = [
  'errorContainer',
  'errorAlert',
  'errorMessage',
];

export const errorContainerSlots: Record<ErrorContainerClassKey, [ErrorContainerClassKey]> = {
  errorContainer: ['errorContainer'],
  errorAlert: ['errorAlert'],
  errorMessage: ['errorMessage'],
};
