/* eslint-disable no-await-in-loop */
/**
 * LLM Documentation Generator
 *
 * This script generates LLM-optimized documentation by processing MUI component markdown files,
 * API documentation, and non-component documentation files to create comprehensive, standalone documentation.
 *
 * ## Main Workflow:
 *
 * 1. **Component Processing**:
 *    - Discovers all components using the API docs builder infrastructure
 *    - For each component, finds its markdown documentation and API JSON
 *    - Processes markdown by replacing `{{"demo": "filename.js"}}` syntax with actual code snippets
 *    - Appends API documentation (props, slots, CSS classes) to the markdown
 *    - Outputs to files like `x/react-{project}/react-{component}.md`
 *
 * 2. **Non-Component Processing** (optional):
 *    - Processes markdown files from specified folders (e.g., `charts/getting-started`)
 *    - Applies the same demo replacement logic
 *    - Uses URL transformation logic to maintain consistent paths with components
 *    - Outputs to project-specific paths like `x/react-charts/getting-started/installation.md`
 *
 * 3. **API Section Processing**:
 *    - Finds API sections in pages.ts structure under "API reference" items
 *    - Processes both JSON API files and markdown API files
 *    - Handles various file path patterns for API documentation
 *    - Outputs to files like `x/api/charts/{component}.md`
 *
 * 4. **Index Generation** (llms.txt):
 *    - Generates project-specific `llms.txt` files using pages.ts structure
 *    - Organizes all files (components, docs, and APIs) according to navigation hierarchy
 *    - Includes API files in the Resources section of each project
 *    - Creates a root `x/llms.txt` that concatenates all project indexes
 *
 * ## Key Features:
 *
 * - **Demo Replacement**: Converts `{{"demo": "filename.js"}}` to actual JSX/TSX code snippets
 * - **API Integration**: Automatically includes component API documentation (props, slots, CSS)
 * - **Project Settings**: Accepts project settings via CLI to work across different MUI X projects
 * - **Filtering**: Supports grep patterns to process specific components/files
 * - **Pages.ts Integration**: Uses the existing navigation structure for organizing documentation
 * - **Unified Processing**: Processes all project files together for proper cross-referencing
 * - **Regex Support**: findChildrenByTitle supports regex patterns for flexible matching
 *
 * ## Usage Examples:
 *
 * ```bash
 * # Process all MUI X components and docs
 * pnpm tsx scripts/buildLlmsDocs/index.ts --projectSettings ./scripts/buildApiDocs/projectSettings.ts
 *
 * # Process specific components with grep filter
 * pnpm tsx scripts/buildLlmsDocs/index.ts \
 *   --projectSettings ./scripts/buildApiDocs/projectSettings.ts \
 *   --grep "BarChart|LineChart"
 *
 * # Custom output directory
 * pnpm tsx scripts/buildLlmsDocs/index.ts \
 *   --projectSettings ./scripts/buildApiDocs/projectSettings.ts \
 *   --outputDir ./custom-output
 * ```
 *
 * ## Output Structure:
 *
 * - **Components**: `x/react-{project}/react-{component}.md` (e.g., `x/react-charts/react-bar-chart.md`)
 * - **API Documentation**: `x/api/{project}/{api-item}.md` (e.g., `x/api/charts/bar-chart.md`)
 * - **Non-Component Docs**: `x/react-{project}/{category}/{topic}.md` (e.g., `x/react-charts/getting-started/installation.md`)
 * - **Project Index**: `x/react-{project}/llms.txt` (e.g., `x/react-charts/llms.txt`)
 * - **Root Index**: `x/llms.txt` (concatenates all project indexes)
 */

import * as fs from 'fs';
import * as path from 'path';
import yargs, { ArgumentsCamelCase } from 'yargs';
import { kebabCase } from 'es-toolkit/string';
import * as prettier from 'prettier';
import { processMarkdownFile, processApiJson } from '@mui-internal-scripts/generate-llms-txt';
import { ComponentInfo, ProjectSettings } from '@mui-internal/api-docs-builder';
import { getHeaders } from '@mui/internal-markdown';
import findComponents from '@mui-internal/api-docs-builder/utils/findComponents';
import findPagesMarkdown from '@mui-internal/api-docs-builder/utils/findPagesMarkdown';
import { pageToTitleI18n } from 'docs/src/modules/utils/helpers';
import type { MuiPage } from 'docs/src/MuiPage';
import pages from 'docsx/data/pages';

function processApiFile(filePath: string): string {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Parse JSON content and replace "properties" key with "props"
  // Some API JSON files use `properties` key instead of `props`
  const jsonData = JSON.parse(content);
  if (jsonData.properties) {
    jsonData.props = jsonData.properties;
    delete jsonData.properties;
  }
  const modifiedContent = JSON.stringify(jsonData, null, 2);
  return processApiJson(modifiedContent);
}

interface ComponentDocInfo {
  name: string;
  componentInfo: ComponentInfo;
  demos: Array<{ demoPageTitle: string; demoPathname: string }>;
  markdownPath?: string;
  apiJsonPath?: string;
}

interface GeneratedFile {
  outputPath: string;
  title: string;
  description: string;
  originalMarkdownPath: string;
  category: string;
  orderIndex?: number; // Track the order for non-component folders
  projectName: string; // Project that generated this file
}

type CommandOptions = {
  grep?: string;
  outputDir?: string;
  projectSettings?: string;
};

/**
 * Find all components for a project using the API docs builder infrastructure
 */
async function findComponentsToProcess(
  projectSettings: ProjectSettings,
  grep: RegExp | null,
): Promise<ComponentDocInfo[]> {
  const components: ComponentDocInfo[] = [];

  // Iterate through TypeScript projects to find components
  for (const project of projectSettings.typeScriptProjects) {
    const projectComponents = findComponents(path.join(project.rootPath, 'src')).filter(
      (component) => {
        if (projectSettings.skipComponent(component.filename)) {
          return false;
        }

        if (grep === null) {
          return true;
        }

        return grep.test(component.filename);
      },
    );

    for (const component of projectComponents) {
      try {
        // Get component info from project settings
        const componentInfo = projectSettings.getComponentInfo(component.filename);

        // Skip if component should be skipped (internal, etc.)
        const fileInfo = componentInfo.readFile();
        if (fileInfo.shouldSkip) {
          continue;
        }

        // Get demos for this component
        const demos = componentInfo.getDemos();

        // Skip if no demos found (likely not a public component)
        if (demos.length === 0) {
          continue;
        }

        // Get the markdown file path from the first demo
        const firstDemo = demos[0];
        const markdownPath = firstDemo ? firstDemo.filePath : undefined;

        // Get API JSON path
        const apiJsonPath = path.join(
          componentInfo.apiPagesDirectory,
          `${path.basename(componentInfo.apiPathname)}.json`,
        );

        components.push({
          name: componentInfo.name,
          componentInfo,
          demos,
          markdownPath,
          apiJsonPath: fs.existsSync(apiJsonPath) ? apiJsonPath : undefined,
        });
      } catch (error) {
        // Skip components that can't be processed
        continue;
      }
    }
  }

  return components;
}

/**
 * Extract title and description from markdown content
 */
function extractMarkdownInfo(markdownPath: string): { title: string; description: string } {
  try {
    const content = fs.readFileSync(markdownPath, 'utf-8');
    const headers = getHeaders(content);

    // Get title from frontmatter or first h1
    const title =
      headers.title || content.match(/^# (.+)$/m)?.[1] || path.basename(markdownPath, '.md');

    // Extract description from the first paragraph with class="description"
    const descriptionMatch = content.match(/<p class="description">([^<]+)<\/p>/);
    let description = '';

    if (descriptionMatch) {
      description = descriptionMatch[1].trim();
    } else {
      // Fallback: get first paragraph after title (excluding headers)
      const paragraphMatch = content.match(/^# .+\n\n(?!#)(.+?)(?:\n\n|$)/m);
      if (paragraphMatch && !paragraphMatch[1].startsWith('#')) {
        description = paragraphMatch[1].trim();
      }
    }

    return { title, description };
  } catch (error) {
    return {
      title: path.basename(markdownPath, '.md'),
      description: '',
    };
  }
}

/**
 * Find all non-component markdown files from specified folders
 */
function findNonComponentMarkdownFiles(
  folders: string[],
  grep: RegExp | null,
): Array<{ markdownPath: string; outputPath: string }> {
  // Get all markdown files using the existing findPagesMarkdown utility
  const allMarkdownFiles = findPagesMarkdown(path.resolve(process.cwd(), 'docs/data')).map(
    (page) => ({
      ...page,
      pathname: page.pathname.replace(/^-grid\//, '/data-grid/'),
    }),
  );

  const files: Array<{ markdownPath: string; outputPath: string }> = [];

  for (const page of allMarkdownFiles) {
    let extensionMatched = false;
    // Check if the page belongs to one of the specified folders or matches specific file paths
    const belongsToFolder = folders.some((folder) => {
      if (folder.endsWith('.md')) {
        // Handle specific file paths with extensions
        const matches = page.filename.endsWith(folder);
        if (matches) {
          extensionMatched = true;
        }
        return matches;
      }
      // Handle folder paths
      return page.pathname.startsWith(`/${folder}`);
    });
    if (!belongsToFolder) {
      continue;
    }

    // Apply grep filter if specified
    if (grep) {
      const fileName = path.basename(page.filename);
      if (!grep.test(fileName) && !grep.test(page.pathname)) {
        continue;
      }
    }

    let fixedPathname = '';

    if (extensionMatched) {
      fixedPathname = page.filename.replace(/^.*\/data\//, '/');
    } else {
      const fragments = page.filename.split('/');
      const lastFragment = fragments[fragments.length - 1].replace(/\.md$/, '');
      if (lastFragment !== 'index' && lastFragment !== fragments[fragments.length - 2]) {
        fixedPathname = `${page.pathname}/${lastFragment}`;
      } else {
        fixedPathname = page.pathname;
      }
    }

    // Apply fixPathname first, then replaceUrl to get the proper output structure (like components)
    fixedPathname = fixedPathname
      .replace(/\/data-grid\//, '/x/react-data-grid/')
      .replace(/\/date-pickers\//, '/x/react-date-pickers/')
      .replace(/\/charts\//, '/x/react-charts/')
      .replace(/\/tree-view\//, '/x/react-tree-view/')
      .replace(/\/scheduler\//, '/x/react-scheduler/')
      .replace(/\/migration\//, '/x/migration/')
      .replace(/^\//, '');
    const outputPath = `${fixedPathname.replace(/^\//, '').replace(/\/$/, '')}.md`;

    files.push({
      markdownPath: page.filename,
      outputPath,
    });
  }

  return files;
}

/**
 * Process a single component by combining its markdown and API documentation
 */
function processComponent(component: ComponentDocInfo): string | null {
  // Skip if no markdown file found
  if (!component.markdownPath) {
    console.error(`Warning: No markdown file found for component: ${component.name}`);
    return null;
  }

  // Process the markdown file with demo replacement
  let processedMarkdown = processMarkdownFile(component.markdownPath);

  // Read the frontmatter to get all components listed in this markdown file
  const markdownContent = fs.readFileSync(component.markdownPath, 'utf-8');
  const headers = getHeaders(markdownContent);
  const componentsInPage = headers.components || [];

  // Add API sections for all components listed in the frontmatter
  if (componentsInPage.length > 0) {
    for (const componentName of componentsInPage) {
      // Construct the API JSON path for each component
      const apiJsonPath = path.join(
        component.componentInfo.apiPagesDirectory,
        `${kebabCase(componentName)}.json`,
      );

      if (fs.existsSync(apiJsonPath)) {
        const apiMarkdown = processApiFile(apiJsonPath);
        processedMarkdown += `\n\n${apiMarkdown}`;
      } else {
        throw new Error(`Warning: API JSON file not found for ${componentName}: ${apiJsonPath}`);
      }
    }
  } else if (component.apiJsonPath) {
    // Fallback: Add API section for the primary component if no frontmatter components found
    const apiMarkdown = processApiFile(component.apiJsonPath);
    processedMarkdown += `\n\n${apiMarkdown}`;
  }

  return processedMarkdown;
}

/**
 * Format markdown content using prettier
 */
async function formatMarkdown(content: string, filePath: string): Promise<string> {
  // Remove project prefixes from markdown link titles
  // e.g., "Date and Time Pickers - Custom layout" -> "Custom layout"
  const processedContent = content.replace(/\[([^[\]]*?)\s*-\s*([^[\]]*?)\]/g, '[$2]');

  const prettierConfig = await prettier.resolveConfig(filePath);

  return prettier.format(processedContent, {
    ...prettierConfig,
    parser: 'markdown',
  });
}

/**
 * Increase header levels by one (add one # to each header)
 */
function increaseHeaderLevels(content: string): string {
  // Replace headers with one additional #
  // # becomes ##, ## becomes ###, ### becomes ####, etc.
  return content.replace(/^(#{1,5})\s/gm, '#$1 ');
}

/**
 * Recursively flatten API items from nested API sections
 */
function flattenApiItems(page: MuiPage): MuiPage[] {
  const items: MuiPage[] = [];

  if (page.children && page.children.length > 0) {
    for (const child of page.children) {
      if (child.children && child.children.length > 0) {
        // This is a group (like Components or Interfaces), flatten its children
        items.push(...flattenApiItems(child));
      } else {
        // This is a leaf item (actual API page)
        items.push(child);
      }
    }
  } else {
    // This is already a leaf item
    items.push(page);
  }

  return items;
}

/**
 * Process API section to generate markdown files from JSON API data
 */
async function processApiSection(
  apiPage: MuiPage,
  outputDir: string,
  projectName: string,
): Promise<GeneratedFile[]> {
  const generatedFiles: GeneratedFile[] = [];

  // Check if this is an API section
  if (!apiPage.pathname.includes('/api/')) {
    return generatedFiles;
  }

  // Flatten all API items from nested structure
  const apiItems = flattenApiItems(apiPage);

  for (const apiItem of apiItems) {
    try {
      // Skip if no pathname or title
      if (!apiItem.pathname || !apiItem.title) {
        continue;
      }

      // Convert pathname to file paths
      // e.g., "/x/api/data-grid/grid-api" -> "docs/pages/x/api/data-grid/grid-api.json"
      // or with double lastSegment: "/x/api/data-grid/item" -> "docs/pages/x/api/data-grid/item/item.json"
      const pathSegments = apiItem.pathname.split('/');
      const lastSegment = pathSegments[pathSegments.length - 1];
      const projectSegment = pathSegments[pathSegments.length - 2];

      // Try both JSON patterns: direct and double lastSegment
      const jsonFilePath = path.join(process.cwd(), 'docs/pages', `${apiItem.pathname}.json`);
      const jsonFilePathDouble = path.join(
        process.cwd(),
        'docs/pages',
        apiItem.pathname,
        `${lastSegment}.json`,
      );

      // Try both markdown patterns: docs/data and docs/pages with double lastSegment
      const markdownFilePath = path.join(
        process.cwd(),
        'docs/data',
        projectSegment.replace('react-', ''),
        lastSegment,
        `${lastSegment}.md`,
      );
      const markdownFilePathPages = path.join(
        process.cwd(),
        'docs/pages',
        apiItem.pathname,
        `${lastSegment}.md`,
      );
      const markdownFilePathPagesIndex = path.join(
        process.cwd(),
        'docs/pages',
        apiItem.pathname,
        `index.md`,
      );

      let apiMarkdown: string;

      // Check all possible file paths in order of preference
      if (fs.existsSync(jsonFilePath)) {
        // Process the JSON file to markdown
        apiMarkdown = processApiFile(jsonFilePath);
      } else if (fs.existsSync(jsonFilePathDouble)) {
        // Process the JSON file with double lastSegment pattern
        apiMarkdown = processApiFile(jsonFilePathDouble);
      } else if (fs.existsSync(markdownFilePath)) {
        // Process the markdown file from docs/data
        apiMarkdown = processMarkdownFile(markdownFilePath);
      } else if (fs.existsSync(markdownFilePathPages)) {
        // Process the markdown file from docs/pages
        apiMarkdown = processMarkdownFile(markdownFilePathPages);
      } else if (fs.existsSync(markdownFilePathPagesIndex)) {
        // Process the markdown file from docs/pages
        apiMarkdown = processMarkdownFile(markdownFilePathPagesIndex);
      } else {
        throw new Error(
          `Warning: API file not found (tried JSON and markdown in multiple patterns): ${apiItem.pathname}
            - JSON: ${jsonFilePath}, ${jsonFilePathDouble}
            - Markdown: ${markdownFilePath}, ${markdownFilePathPages}, ${markdownFilePathPagesIndex}`,
        );
      }

      // Create output path
      // e.g., "/x/api/data-grid/grid-api" -> "x/api/data-grid/grid-api.md"
      const outputPath = `${apiItem.pathname.replace(/^\//, '')}.md`;
      const fullOutputPath = path.join(outputDir, outputPath);

      // Ensure directory exists
      const outputDirPath = path.dirname(fullOutputPath);
      if (!fs.existsSync(outputDirPath)) {
        fs.mkdirSync(outputDirPath, { recursive: true });
      }

      // Write the markdown file
      fs.writeFileSync(fullOutputPath, apiMarkdown, 'utf-8');

      // Create GeneratedFile info
      const fileInfo: GeneratedFile = {
        outputPath,
        title: apiItem.title,
        description: `API documentation for ${apiItem.title}`,
        originalMarkdownPath: jsonFilePath,
        category: 'api',
        projectName,
      };

      generatedFiles.push(fileInfo);
    } catch (error) {
      console.error(`Error processing API item ${apiItem.pathname}:`, error);
    }
  }

  return generatedFiles;
}

/**
 * Recursively find children of an item with the specified title (supports regex)
 */
function findChildrenByTitle(page: MuiPage, targetTitle: string | RegExp): MuiPage[] {
  const titleMatches =
    typeof targetTitle === 'string'
      ? page.title === targetTitle
      : targetTitle.test(page.title || '');

  if (titleMatches && page.children) {
    return page.children;
  }

  if (page.children) {
    for (const child of page.children) {
      const result = findChildrenByTitle(child, targetTitle);
      if (result.length > 0) {
        return result;
      }
    }
  }

  return [];
}

/**
 * Find the project section in pages.ts for a given project key
 */
function findProjectPagesSection(projectKey: string): MuiPage | null {
  const projectPathMap: Record<string, string> = {
    'data-grid': '/x/react-data-grid-group',
    'date-pickers': '/x/react-date-pickers-group',
    charts: '/x/react-charts-group',
    'tree-view': '/x/react-tree-view-group',
  };

  const targetPathname = projectPathMap[projectKey];
  if (!targetPathname) {
    return null;
  }

  return pages.find((page) => page.pathname === targetPathname) || null;
}

/**
 * Generate structured content based on pages hierarchy
 */
function generateStructuredContent(
  page: MuiPage,
  fileMap: Map<string, GeneratedFile>,
  depth: number = 0,
): string {
  let content = '';

  // Special handling for API sections
  if (page.pathname.includes('/api/') && page.children && page.children.length > 0) {
    const renderedTitle = pageToTitleI18n(page, () => undefined);
    // Add section header
    if (renderedTitle && depth > 0) {
      const headerLevel = depth === 1 ? '##' : '###';
      content += `${headerLevel} ${renderedTitle}\n\n`;
    } else if (page.subheader) {
      const headerLevel = depth === 1 ? '##' : '###';
      content += `${headerLevel} ${page.subheader}\n\n`;
    }

    // For API sections, flatten and list all API items
    const apiItems = flattenApiItems(page);
    for (const apiItem of apiItems) {
      const matchedApiFile = fileMap.get(apiItem.pathname);
      if (matchedApiFile) {
        const title = apiItem.title || matchedApiFile.title;
        const planIndicator = apiItem.plan ? ` (${apiItem.plan})` : '';
        const newFeatureIndicator = apiItem.newFeature ? ' 🆕' : '';
        const plannedIndicator = apiItem.planned ? ' (planned)' : '';

        content += `- [${title}](/${matchedApiFile.outputPath})`;
        if (matchedApiFile.description) {
          content += `: ${matchedApiFile.description}`;
        }
        content += `${planIndicator}${newFeatureIndicator}${plannedIndicator}\n`;
      }
    }
    content += '\n';
    return content;
  }

  // Check if this page has a matching generated file
  const matchedFile = fileMap.get(page.pathname);

  // If this page has children, it's a section
  if (page.children && page.children.length > 0) {
    const renderedTitle = pageToTitleI18n(page, () => undefined);
    // Add section header if it has a title or subheader
    if (renderedTitle && depth > 0) {
      const headerLevel = depth === 1 ? '##' : '###';
      content += `${headerLevel} ${renderedTitle}\n\n`;
    } else if (page.subheader) {
      const headerLevel = depth === 1 ? '##' : '###';
      content += `${headerLevel} ${page.subheader}\n\n`;
    }

    // Process children
    for (const child of page.children) {
      content += generateStructuredContent(child, fileMap, depth + 1);
    }
    content += '\n\n';
  } else if (matchedFile) {
    // This is a leaf page with a matching file
    const renderedTitle = pageToTitleI18n(page, () => undefined);
    const title = renderedTitle || matchedFile.title;
    const planIndicator = page.plan ? ` (${page.plan})` : '';
    const newFeatureIndicator = page.newFeature ? ' 🆕' : '';
    const plannedIndicator = page.planned ? ' (planned)' : '';

    // Don't add indentation for markdown list items - they should start at column 0
    content += `- [${title}](/${matchedFile.outputPath})`;
    if (matchedFile.description) {
      content += `: ${matchedFile.description}`;
    }
    content += `${planIndicator}${newFeatureIndicator}${plannedIndicator}\n`;
  }

  return content;
}

/**
 * Get project display name from project key
 */
function getProjectDisplayNameFromKey(projectKey: string): string {
  const nameMap: Record<string, string> = {
    'data-grid':
      pages.find((page) => page.pathname.startsWith('/x/react-data-grid'))?.title || 'Data Grid',
    'date-pickers':
      pages.find((page) => page.pathname.startsWith('/x/react-date-pickers'))?.title ||
      'Date Pickers',
    charts: pages.find((page) => page.pathname.startsWith('/x/react-charts'))?.title || 'Charts',
    'tree-view':
      pages.find((page) => page.pathname.startsWith('/x/react-tree-view'))?.title || 'Tree View',
    scheduler:
      pages.find((page) => page.pathname.startsWith('/x/react-scheduler'))?.title || 'Scheduler',
  };
  return nameMap[projectKey] || projectKey;
}

/**
 * Get project name from project settings based on TypeScript project names
 */
function getProjectNameFromSettings(projectSettings: ProjectSettings): string {
  // Check TypeScript project names to determine the project
  for (const project of projectSettings.typeScriptProjects) {
    if (project.name.includes('data-grid')) {
      return getProjectDisplayNameFromKey('data-grid');
    }
    if (project.name.includes('date-pickers')) {
      return getProjectDisplayNameFromKey('date-pickers');
    }
    if (project.name.includes('charts')) {
      return getProjectDisplayNameFromKey('charts');
    }
    if (project.name.includes('tree-view')) {
      return getProjectDisplayNameFromKey('tree-view');
    }
    if (project.name.includes('scheduler')) {
      return getProjectDisplayNameFromKey('scheduler');
    }
  }

  // Fallback - try to infer from first TypeScript project name
  const firstProject = projectSettings.typeScriptProjects[0];
  if (firstProject) {
    return firstProject.name
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return 'Unknown';
}

/**
 * Extract project name from TypeScript project or file structure
 */
function inferProjectName(outputPath: string, projectSettings: ProjectSettings): string {
  // Extract project name from output path structure
  const pathParts = outputPath.split('/');

  if (pathParts[0] === 'x') {
    // For x/* paths, use the second part (react-data-grid, react-date-pickers, etc.)
    const component = pathParts[1]?.replace('react-', '') || 'x';
    return getProjectDisplayNameFromKey(component);
  }

  // For other paths, use the project settings to determine the project name
  return getProjectNameFromSettings(projectSettings);
}

/**
 * Generate llms.txt content for a project using pages.ts structure for organization
 */
function generateProjectLlmsTxt(
  generatedFiles: GeneratedFile[],
  projectName: string,
  baseDir: string,
): string {
  // Extract project key from baseDir (e.g., "x/react-data-grid" -> "data-grid")
  const pathParts = baseDir.split('/');
  const projectKey = pathParts[0] === 'x' ? pathParts[1]?.replace('react-', '') || 'x' : baseDir;

  // Find the corresponding section in pages.ts
  const pagesSection = findProjectPagesSection(projectKey);
  if (!pagesSection || !pagesSection.children) {
    throw new Error(`No pages section found for project key: ${projectKey}`);
  }

  // Create file map to link pathnames to generated files
  const fileMap = new Map<string, GeneratedFile>();
  for (const file of generatedFiles) {
    // Convert output path to expected pathname format
    // e.g., "x/react-data-grid/components/usage.md" -> "/x/react-data-grid/components/usage"
    const pathname = `/${file.outputPath.replace(/\.md$/, '')}`;
    fileMap.set(pathname, file);
  }

  // Generate content using pages.ts structure
  let content = `# ${projectName}\n\n`;
  content += `This is the documentation for the ${projectName} package.\n`;
  content += `It contains comprehensive guides, components, and utilities for building user interfaces.\n\n`;

  // Process the pages structure to generate organized content
  for (const child of pagesSection.children) {
    content += generateStructuredContent(child, fileMap, 1);
  }

  return content.trim();
}

/**
 * Main build function
 */
async function buildLlmsDocs(argv: ArgumentsCamelCase<CommandOptions>): Promise<void> {
  const grep = argv.grep ? new RegExp(argv.grep) : null;
  const outputDir = argv.outputDir || path.join(process.cwd(), 'docs/public');

  // Load project settings from the specified path
  if (!argv.projectSettings) {
    throw new Error('--projectSettings is required');
  }

  let projectSettings: ProjectSettings[];
  try {
    const settingsPath = path.resolve(argv.projectSettings);
    const settingsModule = await import(settingsPath);
    const imported = settingsModule.projectSettings || settingsModule.default || settingsModule;
    projectSettings = Array.isArray(imported) ? imported : [imported];
  } catch (error) {
    throw new Error(`Failed to load project settings from ${argv.projectSettings}: ${error}`);
  }

  // Track generated files for llms.txt
  const generatedFiles: GeneratedFile[] = [];
  const projectGeneratedFiles: Map<ProjectSettings, GeneratedFile[]> = new Map();
  const projectLlmsContents: string[] = [];
  let processedCount = 0;

  // Process each project settings individually
  for (const currentProjectSettings of projectSettings) {
    const currentProjectFiles: GeneratedFile[] = [];
    // Find all components for this project
    const components = await findComponentsToProcess(currentProjectSettings, grep);

    // Find non-component markdown files if specified in project settings
    let nonComponentFiles: Array<{ markdownPath: string; outputPath: string }> = [];
    const nonComponentFolders = (currentProjectSettings as any).nonComponentFolders;
    if (nonComponentFolders && nonComponentFolders.length > 0) {
      nonComponentFiles = findNonComponentMarkdownFiles(nonComponentFolders, grep);
    }

    // Process each component
    for (const component of components) {
      try {
        const processedMarkdown = processComponent(component);

        if (!processedMarkdown) {
          continue;
        }

        // Use the component's demo pathname to create the output structure
        // e.g., /x/react-charts/bar-chart/ -> x/react-charts/bar-chart.md
        // Skip paths containing # in the last segment
        let outputFileName;
        if (component.demos[0]) {
          const pathname = component.demos[0].demoPathname.replace(/^\//, '').replace(/\/$/, '');
          const pathParts = pathname.split('/');
          const lastPart = pathParts[pathParts.length - 1];

          if (lastPart.includes('#')) {
            // Skip generating markdown file if last segment contains #
            continue;
          }

          outputFileName = `${pathname}.md`;
        } else {
          outputFileName = `${component.componentInfo.apiPathname.replace(/^\//, '').replace(/\/$/, '')}.md`;
        }

        const outputPath = path.join(outputDir, outputFileName);

        // Check if this file has already been generated (avoid duplicates)
        const existingFile = generatedFiles.find((f) => f.outputPath === outputFileName);
        if (!existingFile) {
          // Ensure the directory exists
          const outputDirPath = path.dirname(outputPath);
          if (!fs.existsSync(outputDirPath)) {
            fs.mkdirSync(outputDirPath, { recursive: true });
          }

          fs.writeFileSync(outputPath, processedMarkdown, 'utf-8');
          processedCount += 1;

          // Track this file for llms.txt
          if (component.markdownPath) {
            const { title, description } = extractMarkdownInfo(component.markdownPath);
            const projectName = inferProjectName(outputFileName, currentProjectSettings);
            const fileInfo = {
              outputPath: outputFileName,
              title,
              description,
              originalMarkdownPath: component.markdownPath,
              category: 'components',
              projectName,
            };
            generatedFiles.push(fileInfo);
            currentProjectFiles.push(fileInfo);
          }
        }
      } catch (error) {
        console.error(`✗ Error processing ${component.name}:`, error);
      }
    }

    // Process non-component markdown files for this project
    for (const file of nonComponentFiles) {
      try {
        // Process the markdown file with demo replacement
        const processedMarkdown = processMarkdownFile(file.markdownPath);

        const outputPath = path.join(outputDir, file.outputPath);

        // Ensure the directory exists
        const outputDirPath = path.dirname(outputPath);
        if (!fs.existsSync(outputDirPath)) {
          fs.mkdirSync(outputDirPath, { recursive: true });
        }

        fs.writeFileSync(outputPath, processedMarkdown, 'utf-8');
        processedCount += 1;

        // Track this file for llms.txt
        const { title, description } = extractMarkdownInfo(file.markdownPath);

        // Extract category from the file path
        // e.g., "x/react-charts/getting-started/installation.md" -> "getting-started"
        const pathParts = file.outputPath.split('/');
        const category = pathParts.reverse()[1];

        // Find the order index based on which folder this file belongs to
        let orderIndex = -1;
        if (nonComponentFolders) {
          for (let i = 0; i < nonComponentFolders.length; i += 1) {
            if (file.markdownPath.includes(`/${nonComponentFolders[i]}/`)) {
              orderIndex = i;
              break;
            }
          }
        }

        const projectName = inferProjectName(file.outputPath, currentProjectSettings);
        const fileInfo = {
          outputPath: file.outputPath,
          title,
          description,
          originalMarkdownPath: file.markdownPath,
          category,
          orderIndex,
          projectName,
        };
        generatedFiles.push(fileInfo);
        currentProjectFiles.push(fileInfo);
      } catch (error) {
        console.error(`✗ Error processing ${file.markdownPath}:`, error);
      }
    }

    // Process API sections for this project
    const projectKey = (() => {
      // Try to infer project key from TypeScript project names
      for (const project of currentProjectSettings.typeScriptProjects) {
        if (project.name.includes('data-grid')) {
          return 'data-grid';
        }
        if (project.name.includes('date-pickers')) {
          return 'date-pickers';
        }
        if (project.name.includes('charts')) {
          return 'charts';
        }
        if (project.name.includes('tree-view')) {
          return 'tree-view';
        }
        if (project.name.includes('scheduler')) {
          return 'scheduler';
        }
      }
      return 'unknown';
    })();

    const pagesSection = findProjectPagesSection(projectKey);
    if (pagesSection) {
      const projectName = getProjectNameFromSettings(currentProjectSettings);
      // Find children of items matching "API reference" (using regex)
      const resourcesChildren = findChildrenByTitle(pagesSection, /api\s*reference/i);
      // Find API sections in the project pages
      for (const child of resourcesChildren) {
        if (child.pathname.includes('/api/')) {
          try {
            const apiFiles = await processApiSection(child, outputDir, projectName);
            // Add API files to current project files and overall list
            currentProjectFiles.push(...apiFiles);
            generatedFiles.push(...apiFiles);
            processedCount += apiFiles.length;
          } catch (error) {
            console.error(`✗ Error processing API section for ${projectKey}:`, error);
          }
        }
      }
      // eslint-disable-next-line no-console
      console.log(`✓ Generated ${processedCount} API files for ${projectName}`);
    }

    // Store project files and generate project-specific llms.txt
    projectGeneratedFiles.set(currentProjectSettings, currentProjectFiles);

    if (currentProjectFiles.length > 0) {
      // Determine the main project directory from the project key
      const projectDisplayName = getProjectNameFromSettings(currentProjectSettings);
      const baseDir = `x/react-${projectKey}`;

      // Generate llms.txt for this project with all files (including API files)
      const llmsContent = generateProjectLlmsTxt(currentProjectFiles, projectDisplayName, baseDir);
      const llmsPath = path.join(outputDir, baseDir, 'llms.txt');
      const formattedLlmsContent = await formatMarkdown(llmsContent, llmsPath);

      // Ensure directory exists
      const llmsDirPath = path.dirname(llmsPath);
      if (!fs.existsSync(llmsDirPath)) {
        fs.mkdirSync(llmsDirPath, { recursive: true });
      }

      fs.writeFileSync(llmsPath, formattedLlmsContent, 'utf-8');
      // eslint-disable-next-line no-console
      console.log(`✓ Generated: ${baseDir}/llms.txt`);
      processedCount += 1;

      // Store formatted content with increased header levels for root llms.txt
      const contentWithIncreasedHeaders = increaseHeaderLevels(formattedLlmsContent);
      projectLlmsContents.push(contentWithIncreasedHeaders);
    }
  }

  // Generate root llms.txt file by concatenating all project content
  if (projectLlmsContents.length > 0) {
    const rootHeader =
      '# MUI X Documentation\n\n' +
      'This documentation covers all MUI X packages including Data Grid, Date Pickers, Charts, Tree View, and other components.\n\n' +
      '---\n\n';
    const rootLlmsContent = rootHeader + projectLlmsContents.join('\n\n---\n\n');
    const rootLlmsPath = path.join(outputDir, 'x', 'llms.txt');
    const formattedRootLlmsContent = await formatMarkdown(rootLlmsContent, rootLlmsPath);

    // Ensure directory exists
    const rootLlmsDirPath = path.dirname(rootLlmsPath);
    if (!fs.existsSync(rootLlmsDirPath)) {
      fs.mkdirSync(rootLlmsDirPath, { recursive: true });
    }

    fs.writeFileSync(rootLlmsPath, formattedRootLlmsContent, 'utf-8');
    processedCount += 1;
  }

  // eslint-disable-next-line no-console
  console.log(`\nCompleted! Generated ${processedCount} files in ${outputDir}`);
}

/**
 * CLI setup
 */
yargs(process.argv.slice(2))
  .command({
    command: '$0',
    describe: 'Generates LLM-optimized documentation for MUI X components.',
    builder: (command: any) => {
      return command
        .option('grep', {
          description:
            'Only generate files for components matching the pattern. The string is treated as a RegExp.',
          type: 'string',
        })
        .option('outputDir', {
          description: 'Output directory for generated markdown files.',
          type: 'string',
          default: './docs/public',
        })
        .option('projectSettings', {
          description:
            'Path to the project settings module that exports ProjectSettings interface.',
          type: 'string',
          demandOption: true,
        });
    },
    handler: buildLlmsDocs,
  })
  .help()
  .strict(true)
  .version(false)
  .parse();
