/* eslint-disable no-await-in-loop -- Stage dependencies and check consumers sequentially in one isolated directory. */
import { spawnSync } from 'node:child_process';
import { cp, mkdir, mkdtemp, readFile, realpath, rm, symlink, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const testDirectory = dirname(fileURLToPath(import.meta.url));
const root = join(testDirectory, '../..');
// Keep access to the installed React types, but give consumers their own package resolution.
const consumer = await mkdtemp(join(root, 'node_modules/.charts-declarations-'));
const staged = new Set();

async function stagePackage(name) {
  if (staged.has(name)) {
    return;
  }
  staged.add(name);
  const source = join(root, 'packages', name.replace('@mui/', ''));
  const manifest = JSON.parse(await readFile(join(source, 'package.json'), 'utf8'));
  const destination = join(consumer, 'node_modules', name);
  // Copy rather than link: transitive imports must resolve built packages, never workspace src/.
  await cp(join(source, 'build'), destination, { recursive: true });
  for (const [dependency, version] of Object.entries({
    ...manifest.peerDependencies,
    ...manifest.optionalDependencies,
    ...manifest.dependencies,
  })) {
    if (version.startsWith('workspace:')) {
      await stagePackage(dependency);
    } else {
      const installed = await realpath(join(source, 'node_modules', dependency)).catch((error) => {
        if (error.code === 'ENOENT') {
          return null;
        }
        throw error;
      });
      if (installed) {
        const link = join(destination, 'node_modules', dependency);
        await mkdir(dirname(link), { recursive: true });
        await symlink(installed, link, 'junction');
      }
    }
  }
}

try {
  await stagePackage('@mui/x-charts-premium');
  await cp(join(testDirectory, 'fixtures'), join(consumer, 'src'), { recursive: true });
  for (const compiler of ['typescript', '@typescript/native']) {
    const compilerManifestPath = require.resolve(`${compiler}/package.json`);
    const compilerManifest = JSON.parse(await readFile(compilerManifestPath, 'utf8'));
    const executable = join(
      dirname(compilerManifestPath),
      compilerManifest.bin.tsc ?? compilerManifest.bin.tsc6,
    );
    const compilerVersion = spawnSync(process.execPath, [executable, '--version'], {
      encoding: 'utf8',
    }).stdout.trim();
    for (const mode of ['esm', 'commonjs']) {
      await writeFile(
        join(consumer, 'package.json'),
        JSON.stringify({ private: true, type: mode === 'esm' ? 'module' : 'commonjs' }),
      );
      // Each fixture is a separate program: importing Premium or an opt-in augmentation must
      // not mask invalid Community declarations or silently widen the default callback types.
      for (const fixture of [
        'community',
        'pro',
        'premium',
        'keyboard',
        'rangeBarOnClick',
        'gestures',
      ]) {
        await writeFile(
          join(consumer, 'tsconfig.json'),
          JSON.stringify({
            compilerOptions: {
              target: 'ES2022',
              lib: ['ES2022', 'DOM', 'DOM.Iterable'],
              module: mode === 'esm' ? 'ESNext' : 'NodeNext',
              moduleResolution: mode === 'esm' ? 'bundler' : 'NodeNext',
              jsx: 'react-jsx',
              strict: true,
              noEmit: true,
              skipLibCheck: false,
              types: ['react', 'react-dom'],
            },
            files: [`src/${fixture}.spec.tsx`],
          }),
        );
        process.stdout.write(`${compilerVersion}: ${mode}, ${fixture}\n`);
        const result = spawnSync(
          process.execPath,
          [executable, '-p', consumer, '--pretty', 'false'],
          {
            stdio: 'inherit',
          },
        );
        if (result.error) {
          throw result.error;
        }
        if (result.status !== 0) {
          throw new Error(`Declaration check failed: ${compiler}, ${mode}, ${fixture}`);
        }
      }
    }
  }
} finally {
  await rm(consumer, { recursive: true, force: true });
}
