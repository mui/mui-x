/**
 * Checks whether a file's MIME type matches any entry in an accepted types list.
 *
 * Supports:
 * - Exact matches: `'application/pdf'`
 * - Wildcard subtypes: `'image/*'`
 *
 * Note: file extension patterns (e.g. `'.pdf'`) are **not** supported.
 * Use MIME types only.
 *
 * @param fileType  The MIME type of the file (e.g. `'image/png'`).
 * @param acceptedTypes  The list of accepted MIME type patterns.
 * @returns `true` when the file type matches at least one accepted pattern.
 */
export function matchesMimeType(fileType: string, acceptedTypes: string[]): boolean {
  if (acceptedTypes.length === 0) {
    return true;
  }

  const normalized = fileType.toLowerCase().trim();

  return acceptedTypes.some((accepted) => {
    const pattern = accepted.toLowerCase().trim();

    if (pattern === normalized) {
      return true;
    }

    if (pattern.endsWith('/*')) {
      const prefix = pattern.slice(0, -1);
      return normalized.startsWith(prefix);
    }

    return false;
  });
}
