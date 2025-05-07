import { Plugin } from 'vite';
import path from 'path';

interface RedirectRule {
  test: RegExp;
  from: string;
  to: string;
}

const cleanDepName = (name: string) => {
  // If the name starts with '@', we need to split it into scope and lib
  // e.g. `@mui/material/Button` -> `@mui/material`
  if (name.startsWith('@')) {
    const [scope, lib] = name.split('/');
    return `${scope}/${lib}`;
  }
  // If the name does not start with '@', we only care about the first part
  // e.g. `material/Button` -> `material`
  return name.split('/')[0];
};

export function redirectImports(rules: RedirectRule[]): Plugin {
  return {
    name: 'vite-plugin-redirect-imports',
    enforce: 'pre',

    config(config) {
      config.optimizeDeps ??= {};
      config.optimizeDeps.include ??= [];

      // Collect all 'from' and 'to' package names for exclusion
      const depsToInclude = new Set<string>(
        // Include all packages that are used in the rules
        // We need to use the package name, so we clean it up in case we are replacing a deep import
        rules.flatMap(({ from, to }) => [cleanDepName(from), cleanDepName(to)]),
      );

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
