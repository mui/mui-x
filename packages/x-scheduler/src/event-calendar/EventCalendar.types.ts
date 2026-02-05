import { EventCalendarParameters } from '@mui/x-scheduler-headless/use-event-calendar';
import { SchedulerTranslations } from '../models/translations';
import type { EventCalendarClasses } from './eventCalendarClasses';

export interface EventCalendarProps<TEvent extends object, TResource extends object>
  extends React.HTMLAttributes<HTMLDivElement>, EventCalendarParameters<TEvent, TResource> {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<EventCalendarClasses>;
  /**
   * Translation overrides for the component's texts.
   */
  translations?: Partial<SchedulerTranslations>;
  /**
   * If `true`, the AI helper feature is enabled.
   * Allows users to create events by describing them in natural language.
   * @default false
   */
  aiHelper?: boolean;
  /**
   * API key for the LLM provider (OpenAI or Anthropic).
   * Required if `aiHelper` is `true`.
   */
  aiHelperApiKey?: string;
  /**
   * The LLM provider to use.
   * @default 'openai'
   */
  aiHelperProvider?: 'openai' | 'anthropic';
  /**
   * The model to use for parsing natural language.
   * @default 'gpt-4o-mini' for OpenAI, 'claude-3-haiku-20240307' for Anthropic
   */
  aiHelperModel?: string;
  /**
   * Default event duration in minutes when end time is not specified.
   * @default 60
   */
  aiHelperDefaultDuration?: number;
  /**
   * Additional context to provide to the LLM for better parsing.
   */
  aiHelperExtraContext?: string;
}
