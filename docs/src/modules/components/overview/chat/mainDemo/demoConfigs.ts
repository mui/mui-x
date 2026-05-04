import { SOURCE_CODE_REPO, SOURCE_GITHUB_BRANCH } from 'docs/constants';
import { agentSource, captionsSource, messengerSource, widgetSource } from './generatedCodeSources';
import type { ChatView } from './ViewToggleGroup';

type OverviewDemoTab = {
  tab: string;
  code: string;
  language: string;
};

type OverviewDemoConfig = {
  title: string;
  githubSourcePath: string;
  tabs: OverviewDemoTab[];
};

function createSourceUrl(sourcePath: string) {
  return `${SOURCE_CODE_REPO}/blob/${SOURCE_GITHUB_BRANCH}/${sourcePath}`;
}

function createCodeDemo(title: string, githubSourcePath: string, code: string): OverviewDemoConfig {
  return {
    title,
    githubSourcePath,
    tabs: [{ tab: 'App.tsx', code, language: 'tsx' }],
  };
}

export const chatOverviewDemos: Record<ChatView, OverviewDemoConfig> = {
  messenger: createCodeDemo(
    'Multi-conversation inbox',
    'docs/data/chat/material/examples/multi-conversation/MultiConversation.tsx',
    messengerSource,
  ),
  agent: createCodeDemo(
    'Agentic code assistant',
    'docs/data/chat/material/examples/agentic-code/AgenticCode.tsx',
    agentSource,
  ),
  widget: createCodeDemo(
    'Intercom-style widget',
    'docs/data/chat/headless/examples/intercom-style/IntercomStyleChat.tsx',
    widgetSource,
  ),
  captions: createCodeDemo(
    'Grouped message timeline',
    'docs/data/chat/headless/examples/grouped-message-timeline/GroupedMessageTimeline.tsx',
    captionsSource,
  ),
};

export function getChatOverviewDemoSourceUrl(view: ChatView) {
  return createSourceUrl(chatOverviewDemos[view].githubSourcePath);
}
