import { TypesPageShell } from 'docsx/src/modules/api-docs/TypesPageShell';
import { TypesGridAggregationFunction } from './types.grid-aggregation-function';

const allowedProps = [];

export default function Page() {
  return (
    <TypesPageShell name="GridAggregationFunction" allowedProps={allowedProps}>
      <TypesGridAggregationFunction />
    </TypesPageShell>
  );
}
