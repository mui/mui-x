import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesGridAggregationFunctionDataSource } from './types.grid-aggregation-function-data-source';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="GridAggregationFunctionDataSource" allowedProps={allowedProps}>
      <TypesGridAggregationFunctionDataSource />
    </TypesPageShell>
  );
}
