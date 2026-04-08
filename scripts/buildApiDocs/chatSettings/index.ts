import path from 'path';
import fs from 'fs';
import { LANGUAGES } from 'docs/config';
import { ProjectSettings, ComponentReactApi, HookReactApi } from '@mui-internal/api-docs-builder';
import findApiPages from '@mui-internal/api-docs-builder/utils/findApiPages';
import generateUtilityClass, { isGlobalState } from '@mui/utils/generateUtilityClass';
import { getComponentImports, getComponentInfo } from './getComponentInfo';

type PageType = { pathname: string; title: string; plan?: 'community' | 'pro' | 'premium' };

function getNonComponentFolders(): string[] {
  try {
    return fs
      .readdirSync(path.join(process.cwd(), 'docs/data/chat'), { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory() && dirent.name !== 'components')
      .map((dirent) => `chat/${dirent.name}`)
      .sort();
  } catch (error) {
    // Fallback to empty array if directory doesn't exist
    console.warn('Could not read the directories:', error);
    return [];
  }
}

export const projectChatSettings: ProjectSettings = {
  output: {
    apiManifestPath: path.join(process.cwd(), 'docs/data/chatApiPages.ts'),
  },
  onWritingManifestFile: (
    builds: PromiseSettledResult<ComponentReactApi | HookReactApi | null | never[]>[],
  ) => {
    const pages = builds
      .map((build) => {
        if (build.status === 'rejected' || !build.value || Array.isArray(build.value)) {
          return null;
        }
        const {
          value: { name, apiPathname },
        } = build;

        return { pathname: apiPathname, title: name };
      })
      .filter((page): page is PageType => page !== null)
      .sort((a: PageType, b: PageType) => a.title.localeCompare(b.title));

    return `import type { MuiPage } from 'docs/src/MuiPage';

const chatApiPages: MuiPage[] = ${JSON.stringify(pages, null, 2)};
export default chatApiPages;
`;
  },
  typeScriptProjects: [
    {
      name: 'x-chat',
      rootPath: path.join(process.cwd(), 'packages/x-chat'),
      entryPointPath: 'src/index.ts',
    },
    {
      name: 'x-chat-headless',
      rootPath: path.join(process.cwd(), 'packages/x-chat-headless'),
      entryPointPath: 'src/index.ts',
    },
  ],
  getApiPages: () => findApiPages('docs/pages/x/api/chat'),
  getComponentInfo,
  translationLanguages: LANGUAGES,
  skipComponent(filename) {
    if (filename.includes('/internals/')) {
      return true;
    }

    // Skip compound component files that export multiple components from a single file.
    // react-docgen cannot handle files with multiple exported component definitions.
    const compoundFiles = [
      'ChatComposer/ChatComposer.tsx',
      'ChatIndicators/ChatIndicators.tsx',
      'ChatMessage/ChatMessage.tsx',
      'ChatMessage/ChatAiPartRenderers.tsx',
      // Unstyled part renderers: compound or missing demos
      'message/parts/ToolPart.tsx',
      'message/parts/FilePart.tsx',
      'message/parts/ReasoningPart.tsx',
      'message/parts/SourceDocumentPart.tsx',
      'message/parts/SourceUrlPart.tsx',
      'message/MessageActionsMenu.tsx',
      // Unstyled internal components without demos
      'conversation/ConversationHeaderInfo.tsx',
      'conversation-list/ConversationListItemActions.tsx',
      'conversation-list/ConversationListItemContent.tsx',
      // Suggestions are consumed through the styled ChatBox examples, not documented as standalone headless API pages.
      'suggestions/SuggestionItem.tsx',
      'suggestions/SuggestionsRoot.tsx',
      // Internal implementation detail of ChatBox, not exported from the package index.
      'ChatBox/ChatBoxContent.tsx',
      // Internal default icon components, not intended as public API.
      'icons/DefaultAttachIcon.tsx',
      'icons/DefaultCloseIcon.tsx',
      'icons/DefaultFileIcon.tsx',
      'icons/DefaultNewChatIcon.tsx',
      'icons/DefaultSendIcon.tsx',
      'icons/DefaultSettingsIcon.tsx',
      'icons/DefaultMenuIcon.tsx',
    ];
    if (compoundFiles.some((f) => filename.includes(f))) {
      return true;
    }

    return false;
  },
  skipAnnotatingComponentDefinition: true,
  translationPagesDirectory: 'docs/translations/api-docs/chat',
  importTranslationPagesDirectory: 'docsx/translations/api-docs/chat',
  getComponentImports,
  propsSettings: {
    propsWithoutDefaultVerification: [],
  },
  generateClassName: generateUtilityClass,
  isGlobalClassName: isGlobalState,
  nonComponentFolders: [...getNonComponentFolders()],
};
