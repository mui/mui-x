import { pathToFileURL } from 'node:url';
import { styleText } from 'node:util';

export const dim = (s: string) => styleText('dim', s);
export const red = (s: string) => styleText('red', s);
export const green = (s: string) => styleText('green', s);
export const cyan = (s: string) => styleText('cyan', s);
export const fileUrl = (filePath: string) => pathToFileURL(filePath).href;
