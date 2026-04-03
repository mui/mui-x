import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import * as renameFieldRef from '../rename-field-ref';
import * as removeEnableAccessibleFieldDOMStructure from '../remove-enable-accessible-field-dom-structure';

const allModules = [renameFieldRef, removeEnableAccessibleFieldDOMStructure];

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  allModules.forEach((module) => {
    file.source = module.default(file, api, options);
  });

  return file.source;
}

export const testConfig = {
  allModules,
};
