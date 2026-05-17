import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import * as migrateSlots from '../migrate-slots';

const allModules = [migrateSlots];

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  allModules.forEach((module) => {
    file.source = module.default(file, api, options);
  });

  return file.source;
}

export const testConfig = {
  allModules,
};
