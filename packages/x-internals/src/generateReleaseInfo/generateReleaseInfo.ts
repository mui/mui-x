/// <reference types="node" />
/**
 * Generates a base64-encoded release timestamp for license validation.
 * Used at build time to inject into packages; accepts optional date for testing.
 */
export function generateReleaseInfo(releaseDate?: Date): string {
  const date =
    releaseDate ??
    (() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return today;
    })();
  return Buffer.from(date.getTime().toString()).toString('base64');
}
