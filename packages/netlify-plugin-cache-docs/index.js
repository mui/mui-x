/* eslint-disable no-console */
const path = require('path');
const fse = require('fs-extra');

const CACHE_OUTPUT_FILE = 'cache-output.json';

function generateAbsolutePaths(context) {
  const { constants } = context;

  const workspaceRoot = path.dirname(constants.CONFIG_PATH);
  const docsWorkspacePath = path.join(workspaceRoot, 'docs');

  const nextjsBuildDir = path.join(docsWorkspacePath, '.next', 'cache');

  return { nextjsBuildDir };
}

module.exports = {
  async onPreBuild(context) {
    const { constants, utils } = context;
    const { nextjsBuildDir } = generateAbsolutePaths({ constants });

    const cacheExists = fse.existsSync(nextjsBuildDir);
    console.log("'%s' exists: %s", nextjsBuildDir, String(cacheExists));

    const success = await utils.cache.restore(nextjsBuildDir);

    console.log("Restored the cached '%s' folder: %s", nextjsBuildDir, String(success));
  },
  async onBuild(context) {
    const { constants, utils } = context;
    const { nextjsBuildDir } = generateAbsolutePaths({ constants });

    const cacheExists = fse.existsSync(nextjsBuildDir);

    if (cacheExists) {
      console.log("'%s' exists: %s", nextjsBuildDir, String(cacheExists));

      const success = await utils.cache.save(nextjsBuildDir);

      console.log("Cached '%s' folder: %s", nextjsBuildDir, String(success));
    }
  },
  // debug
  // based on: https://github.com/netlify-labs/netlify-plugin-debug-cache/blob/v1.0.3/index.js
  async onEnd({ constants, utils }) {
    const { PUBLISH_DIR } = constants;
    const cacheManifestFileName = CACHE_OUTPUT_FILE;
    const cacheManifestPath = path.join(PUBLISH_DIR, cacheManifestFileName);
    console.log('Saving cache file manifest for debugging...');
    const files = await utils.cache.list();
    await fse.mkdirp(PUBLISH_DIR);
    await fse.writeJSON(cacheManifestPath, files, { spaces: 2 });
    console.log(`Cache file count: ${files.length}`);
    console.log(`Cache manifest saved to ${cacheManifestPath}`);
    console.log(`Please download the build files to inspect ${cacheManifestFileName}.`);
    console.log('Instructions => http://bit.ly/netlify-dl-cache');
  },
};
