import { Unstable_PromptResponse as PromptResponse } from '@mui/x-data-grid-premium';
import { mockPrompts } from '../constants/prompts';

export const mockPromptResolver = (query: string, _: string) => {
  const resolved = mockPrompts.get(query.toLowerCase().trim());

  return new Promise<PromptResponse>((resolve, reject) => {
    setTimeout(() => {
      if (resolved) {
        resolve(resolved);
      } else {
        console.error(`Unsupported query: ${query}`);
        reject(new Error('Could not process prompt'));
      }
    }, 1000);
  });
};
