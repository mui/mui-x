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

export const CWD = process.cwd();

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
  /** Interfaces to generate dedicated documentation pages for */
  documentedInterfaces?: {
    extraPackages?: string[];
    names: string[];
  };
  /** Data grid API interfaces embedded in demo pages (data-grid only) */
  apiInterfaces?: string[];
}

// ---------------------------------------------------------------------------
// All families
// ---------------------------------------------------------------------------

const PRODUCT_FAMILIES: ProductFamily[] = [
  dataGridFamily,
  datePickersFamily,
  chartsFamily,
  treeViewFamily,
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

/** Interface documentation entries derived from families that define them. */
export function getInterfacesToDocument(): {
  folder: string;
  packages: string[];
  documentedInterfaces: string[];
}[] {
  return PRODUCT_FAMILIES.filter((f) => f.documentedInterfaces).map((f) => ({
    folder: f.section,
    packages: [...f.packages, ...(f.documentedInterfaces!.extraPackages ?? [])],
    documentedInterfaces: f.documentedInterfaces!.names,
  }));
}

/** Data grid API interfaces (embedded in demo pages). */
export function getDatagridApiInterfaces(): string[] {
  const dgFamily = PRODUCT_FAMILIES.find((f) => f.section === 'data-grid');
  return dgFamily?.apiInterfaces ?? [];
}
