import { Plugin } from 'vite';
import path from 'path';

interface RedirectRule {
  test: RegExp;
  from: string;
  to: string;
  include?: string[];
}

export function redirectImports(rules: RedirectRule[]): Plugin {
  return {
    name: 'vite-plugin-redirect-imports',
    enforce: 'pre',

    config(config) {
      config.optimizeDeps ??= {};
      config.optimizeDeps.include ??= [];

      const depsToInclude = new Set<string>(rules.flatMap((rule) => rule.include ?? []));

      // Ignore already-included deps
      config.optimizeDeps.include.forEach((dep) => depsToInclude.delete(dep));
      config.optimizeDeps.include.push(...depsToInclude);
    },

    async resolveId(source, importer) {
      if (!importer) return null;

      const normalizedImporter = importer.split(path.sep).join('/');

      for (const rule of rules) {
        if (!rule.test.test(normalizedImporter)) continue;

        // Match `from` or `from/...`
        const match = source === rule.from || source.startsWith(`${rule.from}/`);
        if (!match) continue;

        const newSource = rule.to + source.slice(rule.from.length);

        return this.resolve(newSource, importer, { skipSelf: true });
      }

      return null;
    },
  };
}
