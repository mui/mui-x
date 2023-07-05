const path = require('path');
const { promises: fs, readFileSync } = require('fs');
const ts = require('typescript');

module.exports = async function loader() {
  const configFilePath = this.resourcePath;
  const configFileContent = readFileSync(configFilePath, 'utf-8');

  const compilerOptions = {
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS,
  };

  const transpileResult = ts.transpileModule(configFileContent, {
    fileName: configFilePath,
    compilerOptions,
  });

  const compiledCode = transpileResult.outputText;
  // eslint-disable-next-line no-eval
  const config = eval(compiledCode);

  const examples = await Promise.all(
    Object.keys(config.examples || {}).map(async (key) => {
      const example = config.examples[key];
      const updatedExample = {};

      await Promise.all(
        Object.keys(example).map(async (key2) => {
          const moduleFilepath = path.join(path.dirname(this.resourcePath), example[key2]);
          const code = await fs.readFile(moduleFilepath, { encoding: 'utf8' });

          updatedExample[key2] = { name: example[key2], path: moduleFilepath, code };
        }),
      );

      return [key, updatedExample];
    }),
  );

  config.examples = Object.fromEntries(examples);

  return `export const examples= ${JSON.stringify(config, null, 2)}`;
};
