import * as path from 'path';
import * as fse from 'fs-extra';

export const getComponentFilesInFolder = (folderPath: string): string[] => {
  const files = fse.readdirSync(folderPath, { withFileTypes: true });
  return files.reduce((acc, file) => {
    if (file.isDirectory()) {
      const filesInFolder = getComponentFilesInFolder(path.join(folderPath, file.name));
      return [...acc, ...filesInFolder];
    }
    if (/[A-Z]+.*\.tsx/.test(file.name)) {
      return [...acc, path.join(folderPath, file.name).replace(/\\/g, '/')];
    }
    return acc;
  }, [] as string[]);
};
