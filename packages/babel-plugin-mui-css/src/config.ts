import { readFileSync } from 'node:fs';
import { dirname, resolve as resolvePath } from 'node:path';
import { packageDirectorySync } from 'pkg-dir';
import * as ts from 'typescript';

const CONFIG_FILENAME = 'mui-css.config.json';

export enum BuildTarget {
  EMOTION = 'emotion',
  CSS = 'css',
}

export type PluginOptions = {
  target: BuildTarget;
};

/** mui-css.config.json options */
export type ProjectOptions = {
  cssVariables: string;
};

export type ProjectConfig = {
  configPath: string;
  options: ProjectOptions;
  variablesCode: string | undefined;
};

const configsByPath = new Map<string, ProjectConfig | null>();

export function getConfig(filepath: string) {
  const configPath = getConfigPath(filepath);
  if (!configPath) {
    return undefined;
  }

  let config = configsByPath.get(configPath);
  if (config !== undefined) {
    return config;
  }

  const options = JSON.parse(readFileSync(configPath).toString());
  config = {
    configPath,
    options,
    variablesCode: readCSSVariables(
      options.cssVariables ? resolvePath(dirname(configPath), options.cssVariables) : undefined,
    ),
  };
  configsByPath.set(configPath, config);
  return config;
}

function getConfigPath(filepath: string) {
  const rootPath = packageDirectorySync({ cwd: dirname(filepath) });
  if (!rootPath) {
    return undefined;
  }
  return resolvePath(rootPath, CONFIG_FILENAME);
}

function readCSSVariables(filepath: string | undefined) {
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
