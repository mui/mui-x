import * as yargs from 'yargs';
import * as TypeDoc from 'typedoc';
import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';
import kebabCase from 'lodash/kebabCase';
import * as prettier from 'prettier';

type Api = {
  name: string;
  description?: string;
  properties: TypeDoc.DeclarationReflection[];
};

// Based on https://github.com/TypeStrong/typedoc-default-themes/blob/master/src/default/partials/type.hbs
function generateType(type) {
  if (type.type === 'union') {
    let text = type.needsParens ? '(' : '';
    text += type.types.map((childType) => generateType(childType)).join(' | ');
    return type.needsParens ? `${text})` : text;
  }
  if (type.type === 'intrinsic') {
    return type.name;
  }
  if (type.type === 'literal') {
    return `${type.value}`;
  }
  if (type.type === 'array') {
    return `${generateType(type.elementType)}[]`;
  }
  if (type.type === 'reflection') {
    // TODO
    if (type.declaration.signatures) {
      if (type.declaration.signatures.length > 1) {
        // TODO
      } else {
        const signature = type.declaration.signatures[0];
        let text = type.needsParens ? '(' : '';
        text += '(';
        text += signature.parameters
          .map((param) => {
            let paramText = param.flags.isRest ? `...${param.name}` : param.name;
            if (param.flags.isOptional) paramText += '?';
            if (param.defaultValue) paramText += '?';
            return `${paramText}: ${generateType(param.type)}`;
          })
          .join(', ');
        text += ')';
        if (signature.type) {
          text += ` => ${generateType(signature.type)}`;
        }
        return type.needsParens ? `${text})` : text;
      }
    } else {
      return '{}';
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
  return '';
}

function escapeCell(value) {
  // As the pipe is used for the table structure
  return value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\|/g, '\\|')
    .replace(/\r?\n/g, '<br />');
}

function linkify(text, apisToGenerate, format: 'markdown' | 'html') {
  if (!text) {
    return '';
  }
  const bracketsRegex = /\[\[([^\]]+)\]\]/g;
  return text.replace(bracketsRegex, (match: string, content: string) => {
    if (!apisToGenerate.includes(content)) {
      return content;
    }
    const url = `/api/${kebabCase(content)}`;
    return format === 'markdown' ? `[${content}](${url})` : `<a href="${url}">${content}</a>`;
  });
}

function generateProperties(api: Api, apisToGenerate) {
  let text = `## Properties
  
  
  | Name | Type | Default | Description |
  |:-----|:-----|:--------|:------------|\n`;

  api.properties.forEach((propertyReflection) => {
    let name = propertyReflection.name;
    const comment = propertyReflection.comment;
    const description = linkify(comment?.shortText, apisToGenerate, 'markdown');

    if (!propertyReflection.flags.isOptional) {
      name = `<span class="prop-name required">${name}<abbr title="required">*</abbr></span>`;
    } else {
      name = `<span class="prop-name">${name}</span>`;
    }

    let defaultValue = '';
    const defaultTag = comment && comment.getTag('default');
    if (defaultTag) {
      defaultValue = `<span class="prop-default">${escapeCell(defaultTag.text)}</span>`;
    }

    const type = `<span class="prop-type">${escapeCell(
      generateType(propertyReflection.type),
    )}</span>`;

    text += `| ${name} | ${type} | ${defaultValue} | ${escapeCell(description)} |\n`;
  });

  return text;
}

function generateMarkdown(api: Api, apisToGenerate) {
  return [
    `# ${api.name} Interface`,
    '',
    `<p class="description">${linkify(api.description, apisToGenerate, 'html')}</p>`,
    '',
    '## Import',
    '',
    '```js',
    `import { ${api.name} } from '@material-ui/x-grid';`,
    '// or',
    `import { ${api.name} } from '@material-ui/data-grid';`,
    '```',
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

function findProperties(
  reflection: TypeDoc.DeclarationReflection,
  project: TypeDoc.ProjectReflection,
) {
  // Type aliases are the intersection of other types
  // We need to collect the properties from each type
  if (reflection.kind === TypeDoc.ReflectionKind.TypeAlias) {
    return (reflection.type as any).types.reduce((acc, type) => {
      const typeReflection = project!.findReflectionByName(
        type.name,
      ) as TypeDoc.DeclarationReflection;

      if (!typeReflection) {
        throw new Error(`Could not find reflection for "${type.name}". Is it exported?`);
      }

      return [...acc, ...findProperties(typeReflection, project)];
    }, []);
  }
  return reflection.children!.filter((child) => {
    return (
      child.kind === TypeDoc.ReflectionKind.Property &&
      !child.comment?.text.match(/@ignore - do not document\./)
    );
  });
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
    'GridSlotsComponentsProps',
    'GridApiRefComponentsProperty',
    'GridCellParams',
    'GridRowParams',
  ];

  apisToGenerate.forEach((apiName) => {
    const reflection = project!.findReflectionByName(apiName);
    if (!reflection) {
      throw new Error(`Could not find reflection for "${apiName}".`);
    }

    const api: Api = {
      name: reflection.name,
      description: reflection.comment?.shortText,
      properties: findProperties(reflection as TypeDoc.DeclarationReflection, project!),
    };
    const slug = kebabCase(reflection!.name);
    const markdown = generateMarkdown(api, apisToGenerate);

    writePrettifiedFile(path.resolve(outputDirectory, `${slug}.md`), markdown, prettierConfigPath);

    writePrettifiedFile(
      path.resolve(outputDirectory, `${slug}.js`),
      `import React from 'react';
import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import { prepareMarkdown } from 'docs/src/modules/utils/parseMarkdown';

const pageFilename = 'api/${slug}';
const requireRaw = require.context('!raw-loader!./', false, /\\/${slug}\\.md$/);

export default function Page({ docs }) {
  return <MarkdownDocs docs={docs} />;
}

Page.getInitialProps = () => {
  const { demos, docs } = prepareMarkdown({ pageFilename, requireRaw });
  return { demos, docs };
};
`,
      prettierConfigPath,
    );

    // eslint-disable-next-line no-console
    console.log('Built API docs for', api.name);
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
