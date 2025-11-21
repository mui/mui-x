export type FileCategory =
  | 'main'
  | 'components'
  | 'hooks'
  | 'data'
  | 'types'
  | 'utils'
  | 'styles'
  | 'context';

export interface SourceFileConfig {
  content: string;
  category: FileCategory;
  description?: string;
  priority?: number;
}

export interface DemoSourceFiles {
  [filename: string]: SourceFileConfig;
}

export interface SourceFileDisplayConfig {
  showCategories: boolean;
  categoryOrder: FileCategory[];
  defaultCategory: FileCategory;
}

export const DEFAULT_DISPLAY_CONFIG: SourceFileDisplayConfig = {
  showCategories: true,
  categoryOrder: ['main', 'components', 'hooks', 'context', 'data', 'types', 'utils', 'styles'],
  defaultCategory: 'main',
};

export const CATEGORY_INFO: Record<FileCategory, { label: string }> = {
  main: {
    label: 'Main',
  },
  components: {
    label: 'Components',
  },
  hooks: {
    label: 'Hooks',
  },
  context: {
    label: 'Context',
  },
  data: {
    label: 'Data',
  },
  types: {
    label: 'Types',
  },
  utils: {
    label: 'Utils',
  },
  styles: {
    label: 'Styles',
  },
};
