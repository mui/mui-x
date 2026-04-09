/**
 * All configuration for the API docs generation pipeline lives here.
 * Product families are the single source of truth for package relationships,
 * component discovery, interface documentation, and prop resolution rules.
 */
import type { PackageConfig } from './types';
import { dataGridFamily } from './families/dataGrid';
import { datePickersFamily } from './families/datePickers';
import { chartsFamily } from './families/charts';
import { treeViewFamily } from './families/treeView';
import { chatFamily } from './families/chat';

export const CWD = process.cwd();

// ---------------------------------------------------------------------------
// Type expansion limits
// ---------------------------------------------------------------------------

/** Component props: max nesting depth before collapsing to "object" */
export const MAX_DEPTH = 4;
/** Component props: objects with more properties than this collapse to "object" */
export const MAX_OBJECT_PROPERTIES = 30;
/** Interface docs: max nesting depth for recursive type expansion */
export const MAX_EXPAND_DEPTH = 3;
/** Interface docs: only expand objects with this many properties or fewer */
export const MAX_EXPAND_PROPERTIES = 10;
/** Interface docs: fall back to source text if expanded result exceeds this length */
export const MAX_EXPANDED_LENGTH = 600;

const DEBUG = process.env.CI === 'true' || process.env.DEBUG === 'true';

/** Logs only when DEBUG is enabled (CI=true or DEBUG=true). */
// eslint-disable-next-line no-console
export const debug = DEBUG ? console.log.bind(console) : () => {};

// ---------------------------------------------------------------------------
// Product family type (used by family definition files)
// ---------------------------------------------------------------------------

export interface ProductFamily {
  section: string;
  /** Packages ordered from base to most complete (community -> pro -> premium) */
  packages: string[];
  includeUnstable?: boolean;
  /**
   * Return true to skip a component from documentation.
   * @param {string} componentName the component name (filename without .tsx)
   * @param {string} filePath the absolute path of the file being analyzed
   * @returns {boolean} true to skip this component
   */
  skipComponent?: (componentName: string, filePath: string) => boolean;
  /** Props whose types should not be expanded (kept as "object" or "arrayOf object") */
  unresolvedProps?: string[];
  /** Interfaces to document */
  interfaces?: {
    /** Extra packages to search beyond the family packages (e.g. x-data-grid-generator) */
    extraPackages?: string[];
    /** Interfaces that get a full documentation page (JSON + translation + JS wrapper) */
    pages?: string[];
    /** Interfaces that only get a JSON blob (embedded in demo pages) */
    jsonOnly?: string[];
  };
}

// ---------------------------------------------------------------------------
// All families
// ---------------------------------------------------------------------------

const PRODUCT_FAMILIES: ProductFamily[] = [
  dataGridFamily,
  datePickersFamily,
  chartsFamily,
  treeViewFamily,
  chatFamily,
];

// ---------------------------------------------------------------------------
// Derived / computed exports
// ---------------------------------------------------------------------------

/** Props that should never be type-resolved regardless of family */
const GLOBAL_UNRESOLVED_PROPS = ['classes', 'slots', 'slotProps'];

/** Combined set of unresolved prop names from all families */
export const UNRESOLVED_OBJECT_PROPS = new Set([
  ...GLOBAL_UNRESOLVED_PROPS,
  ...PRODUCT_FAMILIES.flatMap((f) => f.unresolvedProps ?? []),
]);

/** Props inherited from base types — only documented when declared on the component itself */
export const COMMON_INHERITED_PROPS = new Set([
  'apiRef',
  'children',
  'className',
  'sx',
  'theme',
  'ref',
]);

function getReExportPackages(pkg: string, family: ProductFamily): string[] {
  const idx = family.packages.indexOf(pkg);
  return family.packages.slice(idx).map((p) => `@mui/${p}`);
}

/** Build the flat list of PackageConfig from the product families. */
export function getPackageConfigs(): PackageConfig[] {
  const configs: PackageConfig[] = [];
  for (const family of PRODUCT_FAMILIES) {
    for (const pkg of family.packages) {
      configs.push({
        name: pkg,
        packageDir: `packages/${pkg}`,
        section: family.section,
        includeUnstable: family.includeUnstable,
        skipComponent: family.skipComponent,
        reExportPackages: getReExportPackages(pkg, family),
      });
    }
  }
  return configs;
}

/** Interfaces that get full documentation pages, derived from families. */
export function getInterfacesToDocument(): {
  folder: string;
  packages: string[];
  documentedInterfaces: string[];
}[] {
  return PRODUCT_FAMILIES.filter((f) => f.interfaces?.pages).map((f) => ({
    folder: f.section,
    packages: [...f.packages, ...(f.interfaces!.extraPackages ?? [])],
    documentedInterfaces: f.interfaces!.pages!,
  }));
}

/** Interfaces that only get a JSON blob (embedded in demo pages), per section. */
export function getJsonOnlyInterfaces(): { folder: string; packages: string[]; names: string[] }[] {
  return PRODUCT_FAMILIES.filter((f) => f.interfaces?.jsonOnly).map((f) => ({
    folder: f.section,
    packages: f.packages,
    names: f.interfaces!.jsonOnly!,
  }));
}
