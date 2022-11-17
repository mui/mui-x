import type { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../types';
import renameProps from '../../util/renameProps';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const printOptions = options.printOptions;

  return renameProps({
    root,
    componentName: options.component,
    props: { [options.from]: options.to },
  }).toSource(printOptions);
}
