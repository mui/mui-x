import * as TypeDoc from 'typedoc';
import kebabCase from 'lodash/kebabCase';
import path from 'path';
import { renderInline as renderMarkdownInline } from '@material-ui/monorepo/docs/packages/markdown';
import {
  DeclarationContext,
  escapeCell,
  generateSignatureStr,
  generateTypeStr,
  isDeclarationReflection,
  linkify,
  writePrettifiedFile,
} from './utils';

const INTERFACES_WITH_DEDICATED_PAGES = [
  'GridApi',
  'GridColDef',
  'GridCellParams',
  'GridRowParams',
  'GridSelectionApi',
  'GridFilterApi',
  'GridCsvExportApi',
  'GridCsvExportOptions',
  'GridPrintExportApi',
  'GridDisableVirtualizationApi',
  'GridPrintExportOptions',
  'GridScrollApi',
  'GridEditRowApi',
  'GridEvents',
];

export function generateProperties(
  declaration: DeclarationContext,
  documentedInterfaces: Map<string, boolean>,
) {
  const hasDefaultValue = declaration.properties.reduce((acc, propertyReflection) => {
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

  declaration.properties.forEach((propertyReflection) => {
    let name = propertyReflection.name;
    const type = propertyReflection!.type;
    const signature = propertyReflection.signatures ? propertyReflection.signatures[0] : null;
    const comment = signature?.comment || propertyReflection.comment;
    const description = linkify(comment?.shortText, documentedInterfaces, 'markdown');

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

function generateImportStatement(declaration: DeclarationContext) {
  // TODO: Check if interface was exported
  if (declaration.name === 'GridApi') {
    return `\`\`\`js
import { ${declaration.name} } from '@mui/x-data-grid-pro';
\`\`\``;
  }

  return `\`\`\`js
import { ${declaration.name} } from '@mui/x-data-grid-pro';
// or
import { ${declaration.name} } from '@mui/x-data-grid';
\`\`\``;
}

function generateMarkdown(
  declaration: DeclarationContext,
  documentedInterfaces: Map<string, boolean>,
) {
  return [
    `# ${declaration.name} Interface`,
    '',
    `<p class="description">${linkify(declaration.description, documentedInterfaces, 'html')}</p>`,
    '',
    '## Import',
    '',
    generateImportStatement(declaration),
    '',
    generateProperties(declaration, documentedInterfaces),
  ].join('\n');
}

function findProperties(reflection: TypeDoc.DeclarationReflection) {
  const properties = (reflection.children ?? []).filter((child) =>
    child.kindOf([TypeDoc.ReflectionKind.Property, TypeDoc.ReflectionKind.Method]),
  );
  return properties.sort((a, b) => a.name.localeCompare(b.name));
}

function extractEvents(
  eventsObject: TypeDoc.DeclarationReflection,
  documentedInterfaces: Map<string, boolean>,
) {
  const events: { name: string; description: string }[] = [];
  const allEvents = eventsObject.children!;

  allEvents.forEach((event) => {
    const description = linkify(event.comment?.shortText, documentedInterfaces, 'html');

    events.push({
      name: event.escapedName!,
      description: renderMarkdownInline(description),
    });
  });

  return events.sort((a, b) => a.name.localeCompare(b.name));
}

interface BuildInterfacesDocumentationOptions {
  project: TypeDoc.ProjectReflection;
  prettierConfigPath: string;
  workspaceRoot: string;
  outputDirectory: string;
}

export default function buildInterfacesDocumentation(options: BuildInterfacesDocumentationOptions) {
  const { project, prettierConfigPath, workspaceRoot, outputDirectory } = options;

  const reflectionsToDocument = project.children!.filter(
    (reflection) =>
      isDeclarationReflection(reflection) &&
      [
        TypeDoc.ReflectionKind.TypeAlias,
        TypeDoc.ReflectionKind.Interface,
        TypeDoc.ReflectionKind.Enum,
      ].includes(reflection.kind) &&
      INTERFACES_WITH_DEDICATED_PAGES.includes(reflection.name!),
  );

  const documentedInterfaces = new Map(
    reflectionsToDocument.map((reflection) => [reflection.name, true]),
  );

  reflectionsToDocument.forEach((reflection) => {
    if (!documentedInterfaces.get(reflection.name)) {
      return;
    }

    const context: DeclarationContext = {
      name: reflection.name,
      description: reflection.comment?.shortText,
      properties: findProperties(reflection),
    };

    const slug = kebabCase(reflection!.name);
    const markdown = generateMarkdown(context, documentedInterfaces);

    if (reflection.extendedBy && reflection.extendedBy[0].name === 'GridApi') {
      const json = {
        name: reflection.name,
        description: linkify(reflection.comment?.shortText, documentedInterfaces, 'html'),
        properties: context.properties.map((propertyReflection) => {
          const signature = propertyReflection.signatures ? propertyReflection.signatures[0] : null;
          const comment = signature?.comment || propertyReflection.comment;
          const description = linkify(comment?.shortText, documentedInterfaces, 'html');

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
      console.log('Built JSON file for', context.name);
    } else if (reflection.name === 'GridEvents') {
      const events = extractEvents(reflection, documentedInterfaces);

      writePrettifiedFile(
        path.resolve(workspaceRoot, 'docs/src/pages/components/data-grid/events/events.json'),
        JSON.stringify(events),
        prettierConfigPath,
      );

      // eslint-disable-next-line no-console
      console.log('Built events file');
    } else {
      writePrettifiedFile(
        path.resolve(outputDirectory, `${slug}.md`),
        markdown,
        prettierConfigPath,
      );

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
      console.log('Built API docs for', context.name);
    }
  });

  return documentedInterfaces;
}
