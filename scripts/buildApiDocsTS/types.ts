/**
 * Shared types/interfaces used across the API docs generation pipeline.
 */

// ---------------------------------------------------------------------------
// From typeUtils.ts
// ---------------------------------------------------------------------------

export interface PropTypeInfo {
  name: string;
  description?: string;
}

export interface PropSignature {
  type: string;
  describedArgs: string[];
  returned?: string;
}

export interface PropInfo {
  type: PropTypeInfo;
  default?: string;
  required?: true;
  deprecated?: true;
  deprecationInfo?: string;
  signature?: PropSignature;
  additionalInfo?: Record<string, true>;
  seeMoreLink?: { url: string; text: string };
}

export interface JsDocInfo {
  description: string;
  defaultValue?: string;
  deprecated?: string;
  ignore?: boolean;
  seeMoreLink?: { url: string; text: string };
  params: Map<string, string>;
  /** JSDoc type annotations for params (from {Type} syntax) */
  paramTypes: Map<string, string>;
  returnDescription?: string;
}

// ---------------------------------------------------------------------------
// From index.ts
// ---------------------------------------------------------------------------

export interface PackageConfig {
  name: string;
  packageDir: string;
  section: string;
  discovery: 'whitelist' | 'scan';
  /** For whitelist: component names to document (matched by filename without .tsx) */
  componentNames?: string[];
  /**
   * Skip component predicate (for 'scan' mode)
   * @param {string} filename the absolute path of the file being analyzed
   * @returns {boolean} true to skip this file/component, false to include it
   */
  skipComponent?: (filename: string) => boolean;
  includeUnstable?: boolean;
  reExportPackages: string[];
}

export interface ComponentApi {
  name: string;
  filename: string;
  packageName: string;
  section: string;
  props: Record<string, PropInfo>;
  slots: SlotInfo[];
  classes: ClassInfo[];
  imports: string[];
  muiName: string;
  forwardsRefTo?: string;
  spread?: boolean;
  themeDefaultProps?: boolean | null;
  demos: string;
  inheritance: null;
  cssComponent: false;
  // For translations
  componentDescription: string;
  propDescriptions: Record<string, TranslationPropDesc>;
  slotDescriptions: Record<string, string>;
  classDescriptions: Record<string, TranslationClassDesc>;
}

export interface SlotInfo {
  name: string;
  description: string;
  default?: string;
  class: string | null;
}

export interface ClassInfo {
  key: string;
  className: string;
  description: string;
  isGlobal: boolean;
}

export interface TranslationPropDesc {
  description: string;
  typeDescriptions?: Record<string, { name: string; description: string }>;
  seeMoreText?: string;
}

export interface TranslationClassDesc {
  description: string;
  nodeName?: string;
}

export interface DiscoveredComponent {
  name: string;
  filePath: string;
  packageName: string;
  packageDir: string;
  section: string;
  reExportPackages: string[];
}

export interface DemoInfo {
  demoPageTitle: string;
  demoPathname: string;
}

export type DemoMap = Map<string, DemoInfo[]>;

export interface ConformanceInfo {
  forwardsRefTo?: string;
  spread?: boolean;
  themeDefaultProps?: boolean | null;
}

export interface FileWrite {
  path: string;
  content: string;
}

