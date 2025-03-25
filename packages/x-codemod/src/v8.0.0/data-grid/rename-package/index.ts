import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';

// TODO: Make it generic and move to utils
export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options?: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  root
    .find(j.ImportDeclaration)
    .filter((path) =>
      ['@mui/x-data-grid-pro', '@mui/x-data-grid-premium'].includes(
        path.node.source.value as string,
      ),
    )
    .forEach((path) => {
      const specifiers = path.node.specifiers;
      const filteredSpecifiers = specifiers!.filter(
        (spec) => !(j.ImportSpecifier.check(spec) && spec.imported.name === 'LicenseInfo'),
      );

      // If `LicenseInfo` was found and removed
      if (filteredSpecifiers.length !== specifiers!.length) {
        const licenseImport = j.importDeclaration(
          [j.importSpecifier(j.identifier('LicenseInfo'))],
          j.stringLiteral('@mui/x-license'),
        );

        if (filteredSpecifiers.length > 0) {
          // Keep other imports but remove `LicenseInfo`
          path.node.specifiers = filteredSpecifiers;
          // Insert new import right after the modified import
          j(path).insertAfter(licenseImport);
        } else {
          // Remove import entirely and insert new one at the same position
          j(path).replaceWith(licenseImport);
        }
      }
    });

  const printOptions = options?.printOptions || {
    quote: 'single',
    trailingComma: true,
  };

  return root.toSource(printOptions);
}
