import { JsCodeShiftAPI, JsCodeShiftFileInfo } from '../../../types';
import renameAxisTooltipHook from '../rename-axis-tooltip-hook';

export default function transformer(file: JsCodeShiftFileInfo, api: JsCodeShiftAPI, options: any) {
  [
    // Add others here as they are created
    renameAxisTooltipHook,
  ].forEach((transform) => {
    file.source = transform(file, api, options);
  });

  return file.source;
}
