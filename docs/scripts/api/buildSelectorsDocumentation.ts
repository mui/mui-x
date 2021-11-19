import * as TypeDoc from 'typedoc';
import {ReferenceType} from "typedoc";
import path from "path";
import {generateTypeStr, isDeclarationReflection, isReferenceType, writePrettifiedFile} from './utils';

interface BuildSelectorsDocumentationOptions {
  project: TypeDoc.ProjectReflection;
  prettierConfigPath: string;
  outputDirectory: string;
}

/**
 * The selector has been created using `createSelector`
 */
const isWrappedInCreateSelector = (reflection: TypeDoc.DeclarationReflection) => reflection.type && isReferenceType(reflection.type) && reflection.type.name === 'OutputSelector'

export default function buildSelectorsDocumentation(options: BuildSelectorsDocumentationOptions) {
  const { project, outputDirectory, prettierConfigPath } = options;

  const selectors = project.children!.filter((reflection) => {
    if (
      !isDeclarationReflection(reflection) ||
      ![TypeDoc.ReflectionKind.Function, TypeDoc.ReflectionKind.Variable].includes(
        reflection.kind,
      ) ||
      !reflection.name.endsWith('Selector')
    ) {
      return false;
    }

    if (isWrappedInCreateSelector(reflection)) {
      return true
    }

    const parameters = reflection.signatures?.[0]?.parameters ?? [];

    // Selector not wrapped in `createSelector`
    return parameters.length === 1 && parameters[0].type && isReferenceType(parameters[0].type);
  }).map(selectorReflection => {
    let returnType: TypeDoc.Type | undefined
    if (isWrappedInCreateSelector(selectorReflection)) {
      returnType = (selectorReflection.type as ReferenceType).typeArguments?.[1]
    } else {
      returnType =  selectorReflection.signatures?.[0].type
    }

    if (!returnType) {
      throw new Error('Failed to parse selector')
    }

    const tags = new Map(selectorReflection.comment?.tags?.map(tag => ([tag.tagName, tag])))

    return {
      name: selectorReflection.name,
      returnType: generateTypeStr(returnType),
      deprecated: tags.get('deprecated')?.text?.trim() ?? undefined,
      feature: tags.get('feature')?.text?.trim() ?? undefined,
    }
  })

  writePrettifiedFile(
      path.resolve(outputDirectory, `selectors.json`),
      JSON.stringify(selectors),
      prettierConfigPath,
  );
}
