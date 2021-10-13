import * as yargs from 'yargs';
import * as TypeDoc from 'typedoc';
import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';
import kebabCase from 'lodash/kebabCase';
import * as prettier from 'prettier';
import { renderInline as renderMarkdownInline } from '@material-ui/monorepo/docs/packages/markdown';

type Api = {
  name: string;
  description?: string;
  properties: TypeDoc.DeclarationReflection[];
};

// Based on https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/type.hbs
function generateType(type, needsParenthesis = false) {
  if (type.type === 'union') {
    let text = needsParenthesis ? '(' : '';
    text += type.types.map((childType) => generateType(childType, true)).join(' | ');
    return needsParenthesis ? `${text})` : text;
  }
  if (type.type === 'intrinsic') {
    return type.name;
  }
  if (type.type === 'literal') {
    return `${type.value}`;
  }
  if (type.type === 'array') {
    return `${generateType(type.elementType, true)}[]`;
  }
  if (type.type === 'reflection') {
    if (type.declaration.signatures && type.declaration.signatures.length === 1) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return generateSignature(type.declaration.signatures[0], needsParenthesis);
    }
    if (type.declaration.children) {
      let text = '{ ';
      text += type.declaration.children
        .map((child) => {
          let memberText = child.name;
          if (child.flags.isOptional) {
            memberText += '?';
          }
          return `${memberText}: ${child.type ? generateType(child.type) : 'any'}`;
        })
        .join('; ');
      text += ' }';
      return text;
    }
  }
  if (type.type === 'reference') {
    let text = type.name;
    if (type.typeArguments) {
      text += `<`;
      text += type.typeArguments.map((arg) => generateType(arg)).join(', ');
      text += `>`;
    }
    return text;
  }
  if (type.type === 'indexedAccess') {
    return `${generateType(type.objectType)}[${generateType(type.indexType)}]`;
  }
  if (type.type === 'typeOperator') {
    return `${type.operator} ${generateType(type.target)}`;
  }

  return '';
}

function generateSignature(signature, needsParenthesis = false) {
  let text = needsParenthesis ? '(' : '';
  if (signature.typeParameters?.length) {
    // Handle function generic parameters
    text += '<';
    text += signature.typeParameters
      .map((generic) => {
        let genericLine = generic.name;
        if (generic.type) {
          genericLine += ` extends ${generateType(generic.type)}`;
        }
        if (generic.default) {
          genericLine += ` = ${generateType(generic.default)}`;
        }
        return genericLine;
      })
      .join(', ');
    text += '>';
  }
  text += '(';
  text += signature
    .parameters!.map((param) => {
      let paramText = param.flags.isRest ? `...${param.name}` : param.name;
      if (param.flags.isOptional) {
        paramText += '?';
      }
      if (param.defaultValue) {
        paramText += '?';
      }
      return `${paramText}: ${generateType(param.type)}`;
    })
    .join(', ');
  text += ')';
  if (signature.type) {
    text += ` => ${generateType(signature.type)}`;
  }
  return needsParenthesis ? `${text})` : text;
}

function escapeCell(value) {
  return value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\|/g, '\\|')
    .replace(/\r?\n/g, '<br />');
}

function linkify(text, apisToGenerate, format: 'markdown' | 'html') {
  const bracketsRegexp = /\[\[([^\]]+)\]\]/g;
  return text.replace(bracketsRegexp, (match: string, content: string) => {
    if (!apisToGenerate.includes(content)) {
      return content;
    }
    const url = `/api/data-grid/${kebabCase(content)}/`;
    return format === 'markdown' ? `[${content}](${url})` : `<a href="${url}">${content}</a>`;
  });
}

function generateProperties(api: Api, apisToGenerate) {
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
    const type = propertyReflection!.type as any;
    const signature = propertyReflection.signatures ? propertyReflection.signatures[0] : null;
    const comment = signature?.comment || propertyReflection.comment;
    const description = linkify(comment?.shortText || '', apisToGenerate, 'markdown');

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

    const typeFormatted = `<span class="prop-type">${escapeCell(
      signature ? generateSignature(signature) : generateType(type),
    )}</span>`;

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

function generateMarkdown(api: Api, apisToGenerate) {
  return [
    `# ${api.name} Interface`,
    '',
    `<p class="description">${linkify(api.description || '', apisToGenerate, 'html')}</p>`,
    '',
    '## Import',
    '',
    generateImportStatement(api),
    '',
    generateProperties(api, apisToGenerate),
  ].join('\n');
}

function writePrettifiedFile(filename: string, data: string, prettierConfigPath: string) {
  const prettierConfig = prettier.resolveConfig.sync(filename, {
    config: prettierConfigPath,
  });
  if (prettierConfig === null) {
    throw new Error(
      `Could not resolve config for '${filename}' using prettier config path '${prettierConfigPath}'.`,
    );
  }

  writeFileSync(filename, prettier.format(data, { ...prettierConfig, filepath: filename }), {
    encoding: 'utf8',
  });
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
    const description = linkify(event.comment?.shortText || '', apisToGenerate, 'html');

    events.push({
      name: event.escapedName!,
      description: renderMarkdownInline(description),
    });
  });

  return events.sort((a, b) => a.name.localeCompare(b.name));
}

function run(argv: { outputDirectory?: string }) {
  const outputDirectory = path.resolve(argv.outputDirectory!);
  mkdirSync(outputDirectory, { mode: 0o777, recursive: true });

  const workspaceRoot = path.resolve(__dirname, '../../');
  const prettierConfigPath = path.join(workspaceRoot, 'prettier.config.js');

  const app = new TypeDoc.Application();
  app.options.addReader(new TypeDoc.TSConfigReader());
  app.options.addReader(new TypeDoc.TypeDocReader());
  app.bootstrap({
    entryPoints: ['packages/grid/data-grid/src/index.ts'],
    exclude: ['**/*.test.ts'],
    tsconfig: 'packages/grid/data-grid/tsconfig.json',
  });
  const project = app.convert();

  const apisToGenerate = [
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

  apisToGenerate.forEach((apiName) => {
    const reflection = project!.findReflectionByName(apiName) as TypeDoc.DeclarationReflection;
    if (!reflection) {
      throw new Error(`Could not find reflection for "${apiName}".`);
    }

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
          const description = linkify(comment?.shortText || '', apisToGenerate, 'html');
          const response: any = {
            name: propertyReflection.name,
            description: renderMarkdownInline(description),
            type: signature ? generateSignature(signature) : generateType(propertyReflection.type),
          };
          return response;
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
      console.log('Built API docs for', api.name);
    }
  });
}

yargs
  .command({
    command: '$0 <outputDirectory>',
    describe: 'generates API docs',
    builder: (command) => {
      return command.positional('outputDirectory', {
        description: 'directory where the markdown is written to',
        type: 'string',
      });
    },
    handler: run,
  })
  .help()
  .strict(true)
  .version(false)
  .parse();
