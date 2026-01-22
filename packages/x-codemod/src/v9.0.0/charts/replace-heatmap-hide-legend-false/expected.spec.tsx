// @ts-nocheck

<div>
  <Heatmap series={[{}]} hideLegend={true} />
  <HeatmapPremium series={[{}]} hideLegend={true} />
  <Heatmap series={[{}]} hideLegend={false} />
  <HeatmapPremium series={[{}]} hideLegend={false} />
  <Heatmap hideLegend series={[{}]} />
  <HeatmapPremium hideLegend series={[{}]} />
  <Heatmap hideLegend {...otherProps} />
  <HeatmapPremium hideLegend {...otherProps} />
</div>;
