/**
 * For babel.config.mjs - Node can't load .ts. Sync with src/generateReleaseInfo/generateReleaseInfo.ts
 */
module.exports = function generateReleaseInfo(releaseDate) {
  const date =
    releaseDate ??
    (() => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return today;
    })();
  return btoa(date.getTime().toString());
};
