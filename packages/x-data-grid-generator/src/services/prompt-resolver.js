import { mockPrompts } from '../constants/prompts';
export const mockPromptResolver = (query, _) => {
    const resolved = mockPrompts.get(query.toLowerCase().trim());
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (resolved) {
                resolve(resolved);
            }
            else {
                console.error(`Unsupported query: ${query}`);
                reject(new Error('MUI X: Could not process prompt'));
            }
        }, 1000);
    });
};
