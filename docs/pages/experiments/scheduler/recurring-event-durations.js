import * as React from 'react';
import RecurringEventDurations from 'docs/data/experiments/scheduler/RecurringEventDurations';
import { ExperimentLayout } from 'docs/src/modules/components/ExperimentLayout';

export default function RecurringEventDurationsExperiment() {
  return <RecurringEventDurations />;
}

RecurringEventDurationsExperiment.getLayout = (page) => <ExperimentLayout>{page}</ExperimentLayout>;
