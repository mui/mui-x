/**
 * Build-time utility that generates a base64-encoded release timestamp.
 * Used by babel.config.mjs, next.config.ts, and Vite configs to replace
 * the __RELEASE_INFO__ placeholder in packages at build time.
 */
export default function generateReleaseInfo(releaseDate) {
  const date =
    releaseDate ??
    (() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return today;
    })();
  return btoa(date.getTime().toString());
}
