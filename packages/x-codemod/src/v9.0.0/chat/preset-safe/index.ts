import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import * as renameSlots from '../rename-slots';

const allModules = [renameSlots];

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  allModules.forEach((module) => {
    file.source = module.default(file, api, options);
  });

  return file.source;
}

export const testConfig = {
  allModules,
};
