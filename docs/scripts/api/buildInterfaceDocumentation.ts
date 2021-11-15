import * as TypeDoc from 'typedoc';
import kebabCase from 'lodash/kebabCase';
import path from 'path';
import { renderInline as renderMarkdownInline } from '@material-ui/monorepo/docs/packages/markdown';
import {
  escapeCell,
  generateSignatureStr,
  generateTypeStr,
  linkify,
  writePrettifiedFile,
} from './utils';

interface Api {
  name: string;
  description?: string;
  properties: TypeDoc.DeclarationReflection[];
}

export function generateProperties(api: Api, apisToGenerate: string[]) {
  const hasDefaultValue = api.properties.reduce((acc, propertyReflection) => {
    return acc || !!propertyReflection.comment?.hasTag('default');
  }, false);

  const headers = hasDefaultValue
    ? `
| Name | Type | Default | Description |
|:-----|:-----|:--------|:------------|`
    : `
| Name | Type | Description |
|:-----|:-----|:------------|`;

  let text = `## Properties\n\n${headers}\n`;

  api.properties.forEach((propertyReflection) => {
    let name = propertyReflection.name;
    const type = propertyReflection!.type;
    const signature = propertyReflection.signatures ? propertyReflection.signatures[0] : null;
    const comment = signature?.comment || propertyReflection.comment;
    const description = linkify(comment?.shortText, apisToGenerate, 'markdown');

    if (propertyReflection.flags.isOptional) {
      name = `<span class="prop-name optional">${name}<sup><abbr title="optional">?</abbr></sup></span>`;
    } else {
      name = `<span class="prop-name">${name}</span>`;
    }

    let defaultValue = '';
    const defaultTag = comment && comment.getTag('default');
    if (defaultTag) {
      defaultValue = `<span class="prop-default">${escapeCell(defaultTag.text)}</span>`;
    }

    let typeFormatted = '<span class="prop-type">';
    if (signature) {
      typeFormatted += escapeCell(generateSignatureStr(signature));
    } else if (type) {
      typeFormatted += escapeCell(generateTypeStr(type));
    }
    typeFormatted += '</span>';

    if (hasDefaultValue) {
      text += `| ${name} | ${typeFormatted} | ${defaultValue} | ${escapeCell(description)} |\n`;
    } else {
      text += `| ${name} | ${typeFormatted} | ${escapeCell(description)} |\n`;
    }
  });

  return text;
}

function generateImportStatement(api: Api) {
  // TODO: Check if interface was exported
  if (api.name === 'GridApi') {
    return `\`\`\`js
import { ${api.name} } from '@mui/x-data-grid-pro';
\`\`\``;
  }

  return `\`\`\`js
import { ${api.name} } from '@mui/x-data-grid-pro';
// or
import { ${api.name} } from '@mui/x-data-grid';
\`\`\``;
}

function generateMarkdown(api: Api, apisToGenerate: string[]) {
  return [
    `# ${api.name} Interface`,
    '',
    `<p class="description">${linkify(api.description, apisToGenerate, 'html')}</p>`,
    '',
    '## Import',
    '',
    generateImportStatement(api),
    '',
    generateProperties(api, apisToGenerate),
  ].join('\n');
}

function findProperties(reflection: TypeDoc.DeclarationReflection) {
  const properties = reflection.children!.filter((child) =>
    child.kindOf([TypeDoc.ReflectionKind.Property, TypeDoc.ReflectionKind.Method]),
  );
  return properties.sort((a, b) => a.name.localeCompare(b.name));
}

function extractEvents(eventsObject: TypeDoc.DeclarationReflection, apisToGenerate) {
  const events: { name: string; description: string }[] = [];
  const allEvents = eventsObject.children!;

  allEvents.forEach((event) => {
    const description = linkify(event.comment?.shortText, apisToGenerate, 'html');

    events.push({
      name: event.escapedName!,
      description: renderMarkdownInline(description),
    });
  });

  return events.sort((a, b) => a.name.localeCompare(b.name));
}

interface BuildInterfaceDocumentationOptions {
  reflection: TypeDoc.DeclarationReflection;
  apisToGenerate: string[];
  prettierConfigPath: string;
  workspaceRoot: string;
  outputDirectory: string;
}

export default function buildInterfaceDocumentation(options: BuildInterfaceDocumentationOptions) {
  const { reflection, apisToGenerate, prettierConfigPath, workspaceRoot, outputDirectory } =
    options;

  const api: Api = {
    name: reflection.name,
    description: reflection.comment?.shortText,
    properties: findProperties(reflection),
  };

  const slug = kebabCase(reflection!.name);
  const markdown = generateMarkdown(api, apisToGenerate);

  if (reflection.extendedBy && reflection.extendedBy[0].name === 'GridApi') {
    const json = {
      name: reflection.name,
      description: linkify(reflection.comment?.shortText, apisToGenerate, 'html'),
      properties: api.properties.map((propertyReflection) => {
        const signature = propertyReflection.signatures ? propertyReflection.signatures[0] : null;
        const comment = signature?.comment || propertyReflection.comment;
        const description = linkify(comment?.shortText, apisToGenerate, 'html');

        let typeStr: string = '';
        if (signature) {
          typeStr = generateSignatureStr(signature);
        } else if (propertyReflection.type) {
          typeStr = generateTypeStr(propertyReflection.type);
        }

        return {
          name: propertyReflection.name,
          description: renderMarkdownInline(description),
          type: typeStr,
        };
      }),
    };
    writePrettifiedFile(
      path.resolve(outputDirectory, `${slug}.json`),
      JSON.stringify(json),
      prettierConfigPath,
    );
    // eslint-disable-next-line no-console
    console.log('Built JSON file for', api.name);
  } else if (reflection.name === 'GridEvents') {
    const events = extractEvents(reflection, apisToGenerate);

    writePrettifiedFile(
      path.resolve(workspaceRoot, 'docs/src/pages/components/data-grid/events/events.json'),
      JSON.stringify(events),
      prettierConfigPath,
    );

    // eslint-disable-next-line no-console
    console.log('Built events file');
  } else {
    writePrettifiedFile(path.resolve(outputDirectory, `${slug}.md`), markdown, prettierConfigPath);

    writePrettifiedFile(
      path.resolve(outputDirectory, `${slug}.js`),
      `import * as React from 'react';
import MarkdownDocs from '@material-ui/monorepo/docs/src/modules/components/MarkdownDocs';
import { demos, docs, demoComponents } from './${slug}.md?@mui/markdown';

export default function Page() {
  return <MarkdownDocs demos={demos} docs={docs} demoComponents={demoComponents} />;
}        
    `,
      prettierConfigPath,
    );

    // eslint-disable-next-line no-console
    console.log('Built API docs for', api.name);
  }
}
