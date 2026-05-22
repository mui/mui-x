import { agenticRagScenario } from './agenticRag';
import { aiAssistantScenario } from './aiAssistant';
import { supportWidgetScenario } from './supportWidget';
import { teamInboxScenario } from './teamInbox';
import { cloneScenarioFixture } from './helpers';
import { SCENARIO_IDS, type ScenarioFixture, type ScenarioId } from './types';

export { agenticRagScenario } from './agenticRag';
export { aiAssistantScenario } from './aiAssistant';
export { supportWidgetScenario } from './supportWidget';
export { teamInboxScenario } from './teamInbox';
export * from './helpers';
export * from './types';

export const defaultScenarioId: ScenarioId = 'ai-assistant';

export const scenarioFixtures: ScenarioFixture[] = [
  aiAssistantScenario,
  teamInboxScenario,
  supportWidgetScenario,
  agenticRagScenario,
];

export const scenarioFixtureMap: Record<ScenarioId, ScenarioFixture> = {
  'ai-assistant': aiAssistantScenario,
  'team-inbox': teamInboxScenario,
  'support-widget': supportWidgetScenario,
  'agentic-rag': agenticRagScenario,
};

export const scenarioSummaries = scenarioFixtures.map((scenario) => ({
  id: scenario.id,
  title: scenario.title,
  shortTitle: scenario.shortTitle,
  description: scenario.description,
  category: scenario.category,
  tags: scenario.tags,
}));

export function isScenarioId(value: string): value is ScenarioId {
  return SCENARIO_IDS.includes(value as ScenarioId);
}

export function getScenarioFixture(id: ScenarioId): ScenarioFixture {
  return scenarioFixtureMap[id];
}

export function getClonedScenarioFixture(id: ScenarioId): ScenarioFixture {
  return cloneScenarioFixture(getScenarioFixture(id));
}
