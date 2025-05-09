import { Plugin } from 'vite';
import path from 'path';

interface RedirectRule {
  /**
   * A regex to test importer path against.
   *
   * Eg: /\\/AdapterDateFnsV2\\// will match `/src/AdapterDateFnsV2/index.js`
   */
  test: RegExp;
  /**
   * The import path to match. Any import path that starts with this will be redirected.
   *
   * Eg: 'date-fns' will match `import { format } from 'date-fns'` and `import { format } from 'date-fns/addDays'`
   */
  from: string;
  /**
   * The import path to redirect to. This will be replaced in place of `from`.
   *
   * Eg: 'date-fns-v2' will redirect `import { format } from 'date-fns'` to `import { format } from 'date-fns-v2'`
   */
  to: string;
  /**
   * An array of import paths to include. Use this to force the inclusion of certain dependencies.
   * This is useful when you want to include a dependency that is not included by default.
   *
   * Eg: ['date-fns-v2/**\/*.js']
   */
  include?: string[];
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

      const depsToInclude = new Set<string>([
        ...rules.flatMap((rule) => rule.include ?? []),
        ...rules.flatMap((rule) => cleanDepName(rule.to)),
      ]);

      // Ignore already-included deps
      config.optimizeDeps.include.forEach((dep) => depsToInclude.delete(dep));
      config.optimizeDeps.include.push(...depsToInclude);
    },

    async resolveId(source, importer) {
      if (!importer) {
        return null;
      }

      const normalizedImporter = importer.split(path.sep).join('/');

      for (const rule of rules) {
        if (!rule.test.test(normalizedImporter)) {
          continue;
        }

        // Match `from` or `from/...`
        const match = source === rule.from || source.startsWith(`${rule.from}/`);
        if (!match) {
          continue;
        }

        const newSource = rule.to + source.slice(rule.from.length);

        return this.resolve(newSource, importer, { skipSelf: true });
      }

      return null;
    },
  };
}
