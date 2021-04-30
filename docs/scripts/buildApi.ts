/* eslint-disable no-console */
import * as yargs from 'yargs';
import * as TypeDoc from 'typedoc';
import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';
import kebabCase from 'lodash/kebabCase';

function generateType(type) {
  if (type.type === 'union') {
    let text = type.needsParens ? '(' : '';
    text += type.types.map((childType) => generateType(childType)).join(' | ');
    return type.needsParens ? `${text})` : text;
  }
  if (type.type === 'intrinsic') {
    return type.name;
  }
  if (type.type === 'array') {
    return `${generateType(type.elementType)}[]`;
  }
  if (type.type === 'reflection') {
    if (type.children) {
      // TODO
    } else if (type.declaration.signatures) {
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
  // As the pipe is use for the table structure
  return value.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\|/g, '\\|');
}

function generateProperties(reflection: TypeDoc.Reflection) {
  let text = `## Properties


| Name | Type | Default | Description |
|:-----|:-----|:--------|:------------|\n`;

  reflection.traverse((propertyReflection) => {
    if (!(propertyReflection instanceof TypeDoc.DeclarationReflection)) {
      return;
    }

    let name = propertyReflection.name;
    const comment = propertyReflection.comment;
    const description = comment?.shortText || '';

    if (!propertyReflection.flags.isOptional) {
      name = `<span class="prop-name required">${name}<abbr title="required">*</abbr></span>`;
    } else {
      name = `<span class="prop-name">${name}</span>`;
    }

    let defaultValue = '';
    const defaultTag = comment && comment.getTag('default');
    if (defaultTag) {
      defaultValue = `<span class="prop-default">${defaultTag.text.replace(/\n\r?/g, '')}</span>`;
    }

    const type = `<span class="prop-type">${escapeCell(
      generateType(propertyReflection.type),
    )}</span>`;

    text += `| ${name} | ${type} | ${defaultValue} | ${description} |\n`;
  });

  return text;
}

function generateMarkdown(reflection) {
  return [
    `# ${reflection.name} API`,
    '',
    `<p class="description">${reflection.comment?.shortText || ''}</p>`,
    '',
    '## Import',
    '',
    '```js',
    `import { ${reflection.name} } from '@material-ui/x-grid';`,
    '// or',
    `import { ${reflection.name} } from '@material-ui/data-grid';`,
    '```',
    '',
    generateProperties(reflection),
  ].join('\n');
}

function run(argv: { outputDirectory?: string }) {
  const outputDirectory = path.resolve(argv.outputDirectory!);
  mkdirSync(outputDirectory, { mode: 0o777, recursive: true });

  const app = new TypeDoc.Application();
  app.options.addReader(new TypeDoc.TSConfigReader());
  app.options.addReader(new TypeDoc.TypeDocReader());
  app.bootstrap({
    entryPoints: ['packages/grid/data-grid/src/index.ts'],
    exclude: ['**/*.test.ts'],
    tsconfig: 'packages/grid/data-grid/tsconfig.json',
  });

  const project = app.convert();

  // Generate only a few pages for testing
  const reflections = ['GridColDef', 'GridParamsApi', 'GridColumnApi'].map((name) =>
    project!.findReflectionByName(name),
  );

  reflections.forEach((reflection) => {
    const markdown = generateMarkdown(reflection);

    writeFileSync(path.resolve(outputDirectory, `${kebabCase(reflection!.name)}.md`), markdown);
    writeFileSync(
      path.resolve(outputDirectory, `${kebabCase(reflection!.name)}.js`),
      `import React from 'react';
import MarkdownDocs from 'docs/src/modules/components/MarkdownDocs';
import { prepareMarkdown } from 'docs/src/modules/utils/parseMarkdown';

const pageFilename = 'api/${kebabCase(reflection!.name)}';
const requireRaw = require.context('!raw-loader!./', false, /\\/${kebabCase(
        reflection!.name,
      )}\\.md$/);

export default function Page({ docs }) {
  return <MarkdownDocs docs={docs} />;
}

Page.getInitialProps = () => {
  const { demos, docs } = prepareMarkdown({ pageFilename, requireRaw });
  return { demos, docs };
};\n`,
    );

    console.log('Built markdown docs for', reflection!.name);
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
