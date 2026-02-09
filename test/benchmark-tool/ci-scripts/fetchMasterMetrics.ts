import type { Metadata, Trace } from './types';
import { extractTotalDuration } from './extractTotalDuration';

export async function fetchMasterMetrics(): Promise<Record<string, number>> {
  const masterMetricsByFile: Record<string, number> = {};

  try {
    const contentsResponse = await fetch(
      'https://api.github.com/repos/mnajdova/performance-benchmark-data/contents/mui-x',
    );
    if (!contentsResponse.ok) {
      return masterMetricsByFile;
    }

    const contents = (await contentsResponse.json()) as { type: string; name: string }[];
    const folders = contents
      .filter((item) => item.type === 'dir')
      .map((item) => item.name)
      .sort()
      .reverse();

    if (folders.length === 0) {
      return masterMetricsByFile;
    }

    const latestFolder = folders[0];

    console.warn(`Using latest benchmark folder: ${latestFolder}`);

    const metadataResponse = await fetch(
      `https://raw.githubusercontent.com/mnajdova/performance-benchmark-data/main/mui-x/${latestFolder}/metadata.json`,
    );
    if (!metadataResponse.ok) {
      return masterMetricsByFile;
    }

    const metadata = (await metadataResponse.json()) as Metadata;

    const results = await Promise.all(
      metadata.files.map(async (filePath) => {
        const fileName = filePath.split('/').pop()!;
        const fileResponse = await fetch(
          `https://raw.githubusercontent.com/mnajdova/performance-benchmark-data/main/mui-x/${latestFolder}/${fileName}`,
        );
        if (fileResponse.ok) {
          const trace = (await fileResponse.json()) as Trace;
          return { fileName, duration: extractTotalDuration(trace) };
        }
        return null;
      }),
    );

    for (const result of results) {
      if (result) {
        masterMetricsByFile[result.fileName] = result.duration;
      }
    }
  } catch (error) {
    console.error(error);
  }

  return masterMetricsByFile;
}
