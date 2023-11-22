import type { Collection, JSCodeshift } from 'jscodeshift';

interface RenameCSSClassesArgs {
  root: Collection<any>;
  j: JSCodeshift;
  renamedClasses: Record<string, string>;
}

export default function renameCSSClasses({ root, j, renamedClasses }: RenameCSSClassesArgs) {
  root
    .find(j.Literal)
    .filter(
      (path) =>
        !!Object.keys(renamedClasses).find((className) => {
          const literal = path.node.value as any;
          return (
            typeof literal === 'string' &&
            literal.includes(className) &&
            !literal.includes(renamedClasses[className])
          );
        }),
    )
    .replaceWith((path) => {
      const literal = path.node.value as any;
      const targetClassKey = Object.keys(renamedClasses).find((className) =>
        literal.includes(className),
      )!;
      return j.literal(literal.replace(targetClassKey, renamedClasses[targetClassKey]));
    });
}
