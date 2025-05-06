/**
 * Taken from https://github.com/ikeq/vite-plugin-filter-replace/tree/main
 *
 * Modified to work with vitest browser @v3+
 */

import fs from 'fs/promises';
import { Plugin } from 'vite';
import { PluginBuild } from 'esbuild';
import MagicString, { SourceMap } from 'magic-string';

type ReplaceFn = (source: string, path: string) => string;
type ReplacePair = { from: RegExp | string | string[]; to: string | number };

interface Replacement {
  /**
   * for debugging purpose
   */
  id?: string | number;
  filter: RegExp | string | string[];
  replace: ReplacePair | ReplaceFn | Array<ReplacePair | ReplaceFn>;
}

interface Options extends Pick<Plugin, 'enforce' | 'apply'> {}

function escape(str: string): string {
  return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
}

function parseReplacements(
  replacements: Replacement[],
): Array<Omit<Replacement, 'replace' | 'filter'> & { filter: RegExp; replace: ReplaceFn[] }> {
  if (!replacements || !replacements.length) {
    return [];
  }

  return replacements.reduce((entries: any[], replacement) => {
    const filter =
      replacement.filter instanceof RegExp
        ? replacement.filter
        : new RegExp(
            `(${[]
              .concat(replacement.filter as any)
              .filter((i) => i)
              .map((i: string) => escape(i.trim().replace(/\\+/g, '/')))
              .join('|')})`,
          );
    let { replace = [] } = replacement;

    if (!filter) {
      return entries;
    }
    if (typeof replace === 'function' || !Array.isArray(replace)) {
      replace = [replace];
    }

    replace = replace.reduce((replaceEntries: ReplaceFn[], rp) => {
      if (typeof rp === 'function') {
        return replaceEntries.concat(rp);
      }

      const { from, to } = rp;

      if (from === undefined || to === undefined) {
        return replaceEntries;
      }

      return replaceEntries.concat((source) =>
        source.replace(
          from instanceof RegExp
            ? from
            : new RegExp(
                `(${[]
                  .concat(from as any)
                  .map(escape)
                  .join('|')})`,
                'g',
              ),
          String(to),
        ),
      );
    }, []);

    if (!replace.length) {
      return entries;
    }

    return entries.concat({ ...replacement, filter, replace });
  }, []);
}

export default function pluginFilterReplace(
  replacements: Replacement[] = [],
  options: Options = {},
): Plugin {
  const resolvedReplacements = parseReplacements(replacements);
  let isServe = true;
  let internalSourcemap = false;

  if (!resolvedReplacements.length) {
    return {} as any;
  }

  function replace(code: string, id: string): string;
  // eslint-disable-next-line no-redeclare
  function replace(code: string, id: string, sourcemap: boolean): { code: string; map: SourceMap };
  // eslint-disable-next-line no-redeclare
  function replace(
    code: string,
    id: string,
    sourcemap?: boolean,
  ): string | { code: string; map: SourceMap } {
    const replaced = resolvedReplacements.reduce((c, rp) => {
      if (!rp.filter.test(id)) {
        return c;
      }
      return rp.replace.reduce((text, fn) => fn(text, id), c);
    }, code);

    if (!sourcemap) {
      return replaced;
    }

    return {
      code: replaced,
      map: new MagicString(replaced).generateMap({ hires: true }),
    };
  }

  return {
    name: 'vite-plugin-filter-replace',
    enforce: options.enforce,
    apply: options.apply,
    config: (config, env) => {
      isServe = env.command === 'serve';
      internalSourcemap = !!config.build?.sourcemap;

      if (!isServe) {
        return;
      }

      if (!config.optimizeDeps) {
        config.optimizeDeps = {};
      }
      if (!config.optimizeDeps.esbuildOptions) {
        config.optimizeDeps.esbuildOptions = {};
      }
      if (!config.optimizeDeps.esbuildOptions.plugins) {
        config.optimizeDeps.esbuildOptions.plugins = [];
      }

      config.optimizeDeps.esbuildOptions.plugins.unshift(
        ...resolvedReplacements.map((option) => {
          return {
            name: `vite-plugin-filter-replace${option.id ? `:${option.id}` : ''}`,
            setup(build: PluginBuild) {
              build.onLoad({ filter: option.filter, namespace: 'file' }, async ({ path }) => {
                const source = await fs.readFile(path, 'utf8');

                return {
                  loader: 'default',
                  contents: option.replace.reduce((text, fn) => fn(text, path), source),
                };
              });
            },
          };
        }),
      );
    },
    renderChunk(code, chunk) {
      if (isServe) {
        return null;
      }
      return replace(code, chunk.fileName, internalSourcemap);
    },
    transform(code, id) {
      return replace(code, id, internalSourcemap);
    },
    async handleHotUpdate(ctx) {
      const defaultRead = ctx.read;
      ctx.read = async function read() {
        return replace(await defaultRead(), ctx.file);
      };
    },
  };
}
