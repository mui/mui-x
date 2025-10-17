import type { DemoSourceFiles, FileCategory } from '../types/sourceFiles';

export function createSourceFiles(
  files: Record<
    string,
    {
      content: string;
      category: FileCategory;
      description?: string;
      priority?: number;
    }
  >,
): DemoSourceFiles {
  return Object.entries(files).reduce((acc, [path, config]) => {
    acc[path] = {
      content: config.content,
      category: config.category,
      description: config.description,
      priority: config.priority || 10,
    };
    return acc;
  }, {} as DemoSourceFiles);
}
