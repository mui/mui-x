/**
 * Output generation: creates JSON, JS, and translation files for components.
 */
import { kebabCase } from 'es-toolkit/string';
import type { ComponentApi, FileWrite } from './types';

export function generateComponentFiles(api: ComponentApi): FileWrite[] {
  const files: FileWrite[] = [];
  const slug = kebabCase(api.name);
  const apiDir = `docs/pages/x/api/${api.section}`;
  const translationDir = `docs/translations/api-docs/${api.section}/${slug}`;

  // 1. JSON API file
  const jsonContent: Record<string, any> = {
    props: api.props,
    name: api.name,
    imports: api.imports,
    slots: api.slots,
    classes: api.classes,
  };

  // Add optional metadata
  if (api.spread !== undefined) {
    jsonContent.spread = api.spread;
  }
  if (api.themeDefaultProps !== undefined) {
    jsonContent.themeDefaultProps = api.themeDefaultProps;
  }
  jsonContent.muiName = api.muiName;
  if (api.forwardsRefTo !== undefined) {
    jsonContent.forwardsRefTo = api.forwardsRefTo;
  }
  jsonContent.filename = api.filename;
  jsonContent.inheritance = api.inheritance;
  jsonContent.demos = api.demos;
  jsonContent.cssComponent = api.cssComponent;

  files.push({
    path: `${apiDir}/${slug}.json`,
    content: JSON.stringify(jsonContent),
  });

  // 2. JS wrapper page
  const isDataGrid = api.section === 'data-grid';

  let jsContent: string;
  if (isDataGrid) {
    jsContent = `import * as React from 'react';
import ApiPage from 'docs/src/modules/components/ApiPage';
import mapApiPageTranslations from 'docs/src/modules/utils/mapApiPageTranslations';
import layoutConfig from 'docsx/src/modules/utils/dataGridLayoutConfig';
import jsonPageContent from './${slug}.json';

export default function Page(props) {
  const { descriptions } = props;
  return <ApiPage {...layoutConfig} descriptions={descriptions} pageContent={jsonPageContent} />;
}

export async function getStaticProps() {
  const req = require.context(
    'docsx/translations/api-docs/${api.section}/${slug}',
    false,
    /\\.\\/${slug}.*\\.json$/,
  );
  const descriptions = mapApiPageTranslations(req);

  return { props: { descriptions } };
}
`;
  } else {
    jsContent = `import * as React from 'react';
import ApiPage from 'docs/src/modules/components/ApiPage';
import mapApiPageTranslations from 'docs/src/modules/utils/mapApiPageTranslations';
import jsonPageContent from './${slug}.json';

export default function Page(props) {
  const { descriptions } = props;
  return <ApiPage descriptions={descriptions} pageContent={jsonPageContent} />;
}

export async function getStaticProps() {
  const req = require.context(
    'docsx/translations/api-docs/${api.section}/${slug}',
    false,
    /\\.\\/${slug}.*\\.json$/,
  );
  const descriptions = mapApiPageTranslations(req);

  return { props: { descriptions } };
}
`;
  }

  files.push({ path: `${apiDir}/${slug}.js`, content: jsContent });

  // 3. Translation file
  const translation = {
    componentDescription: api.componentDescription,
    propDescriptions: api.propDescriptions,
    classDescriptions: api.classDescriptions,
    slotDescriptions: api.slotDescriptions,
  };
  files.push({
    path: `${translationDir}/${slug}.json`,
    content: JSON.stringify(translation),
  });

  return files;
}

export function generateManifest(section: string, components: ComponentApi[]): FileWrite {
  type PageType = { pathname: string; title: string; plan?: string };
  const pages: PageType[] = components
    .map((c) => {
      const plan =
        (c.filename.includes('-pro') && 'pro') || (c.filename.includes('-premium') && 'premium');
      return {
        pathname: `/x/api/${section}/${kebabCase(c.name)}`,
        title: c.name,
        ...(plan ? { plan } : {}),
      };
    })
    .sort((a, b) => a.title.localeCompare(b.title));

  // Deduplicate by pathname
  const seen = new Set<string>();
  const unique = pages.filter((p) => {
    if (seen.has(p.pathname)) {
      return false;
    }
    seen.add(p.pathname);
    return true;
  });

  const sectionToVarName: Record<string, string> = {
    'data-grid': 'dataGridApiPages',
    'date-pickers': 'datePickersApiPages',
    charts: 'chartsApiPages',
    'tree-view': 'treeViewApiPages',
    chat: 'chatApiPages',
  };
  const varName = sectionToVarName[section];

  const content = `import type { MuiPage } from '@mui/internal-core-docs/MuiPage';

const ${varName}: MuiPage[] = ${JSON.stringify(unique, null, 2)};
export default ${varName};
`;

  return { path: `docs/data/${varName}.ts`, content };
}
