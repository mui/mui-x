import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve as resolvePath } from 'node:path';
import { packageDirectorySync } from 'pkg-dir';
import * as ts from 'typescript';

const CONFIG_FILENAME = 'mui-css.config.json';

export type ProjectConfig = {
  configPath: string;
  data: any;
  variablesCode: string | undefined;
};

const configsByPath = new Map<string, ProjectConfig | null>();

function getConfigPath(filepath: string) {
  const configPath = resolvePath(packageDirectorySync({ cwd: dirname(filepath) }), CONFIG_FILENAME);
  return configPath;
}

export function getConfig(filepath: string) {
  const configPath = getConfigPath(filepath);
  let config = configsByPath.get(configPath);
  if (config !== undefined) {
    return config;
  }

  if (!existsSync(configPath)) {
    configsByPath.set(configPath, null);
    return null;
  }

  const data = JSON.parse(readFileSync(configPath).toString());
  config = {
    configPath,
    data,
    variablesCode: getCSSVariablesCode(
      data.cssVariables ? resolvePath(dirname(configPath), data.cssVariables) : undefined,
    ),
  };
  configsByPath.set(configPath, config);
  return config;
}

function getCSSVariablesCode(filepath: string | undefined) {
  if (filepath === undefined) {
    return '';
  }

  const code = readFileSync(filepath).toString();

  const result = ts.transpileModule(code, {
    fileName: filepath,
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2016,
    },
  });

  if (result.diagnostics.length > 0) {
    console.error(`[mui-css] Errors compiling ${filepath}`);
    console.error(result.diagnostics);
  }

  return `const vars = (function(exports) {
    ${result.outputText}
    return exports
  })({}).vars;`;
}
