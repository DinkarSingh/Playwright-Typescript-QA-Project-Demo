import type {
  PlaywrightTestConfig,
  ReporterDescription,
} from "@playwright/test";
import type { SlackReporterOptions } from "./reporters/slackReporter";

const reporters: ReporterDescription[] = [];

const isCI = Boolean(process.env.CI || process.env.GITHUB_ACTIONS);
const slackWebhookURL = process.env.SLACK_WEBHOOK_URL;
const pipelineUrl =
  process.env.PIPELINE_URL ||
  (process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
    ? `https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
    : undefined);

if (isCI && slackWebhookURL && pipelineUrl) {
  const options: SlackReporterOptions = { slackWebhookURL, pipelineUrl };
  reporters.push(["./reporters/slackReporter", options]);
}

const config: PlaywrightTestConfig = {
  reporter: reporters,
};

// ts-unused-exports:disable-next-line
export default config;
