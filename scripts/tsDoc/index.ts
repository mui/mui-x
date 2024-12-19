import path from 'path';
import { Application } from 'typedoc';
import ts from 'typescript';

async function main() {
  const entryPoint = './packages/x-charts/src/index.ts';

  const configFileName = ts.findConfigFile(
    path.dirname(entryPoint),
    ts.sys.fileExists,
    'tsconfig.json',
  );

  if (!configFileName) {
    throw new Error('Could not find a valid tsconfig.json');
  }

  // Application.bootstrap also exists, which will not load plugins
  // Also accepts an array of option readers if you want to disable
  // TypeDoc's tsconfig.json/package.json/typedoc.json option readers
  const app = await Application.bootstrap({
    entryPoints: [entryPoint],
    // blockTags: ['@default'],
    jsDocCompatibility: {
      defaultTag: true,
      exampleTag: true,
      ignoreUnescapedBraces: true,
    },
    cleanOutputDir: true,
    excludeTags: ['@internal'],
    tsconfig: configFileName,
  });

  // May be undefined if errors are encountered.
  const project = await app.convert();

  if (project) {
    const outputDir = 'generated-docs';
    // Generate HTML rendered docs
    await app.generateJson(project, `${outputDir}/docs.json`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
