import * as path from 'path';
import * as fs from 'node:fs';
import * as prettier from 'prettier';

export const getComponentFilesInFolder = (folderPath: string): string[] => {
  const files = fs.readdirSync(folderPath, { withFileTypes: true });
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

export const resolvePrettierConfigPath = async () => {
  const prettierConfigPath = await prettier.resolveConfigFile();
  if (!prettierConfigPath) {
    throw new Error(
      `Could not resolve prettier config file.
      Please provide a valid prettier config path or ensure that a prettier config file exists in the project root.`,
    );
  }
  return prettierConfigPath;
};
