export default function notifyAboutMuiXTelemetry() {
  console.log(`[Attention]: MUI X now may collect completely anonymous telemetry regarding usage.`);
  console.log(`This information is used to shape MUI's roadmap and prioritize features.`);
  console.log(
    `You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:`,
  );
  console.log('https://mui.com/x/guides/telemetry');
  console.log();
}
