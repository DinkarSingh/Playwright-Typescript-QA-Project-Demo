import type { Reporter, TestCase, TestResult } from "@playwright/test/reporter";

export type SlackReporterOptions = {
  pipelineUrl: string;
  slackWebhookURL: string;
};

type Results = {
  id: string;
  name: string;
  status: "passed" | "skipped" | "failed" | "timedOut" | "interrupted";
}[];

class SlackReporter implements Reporter {
  private slackWebhookURL: string;
  private pipelineUrl: string;
  private results: Results = [];

  constructor(options: SlackReporterOptions) {
    this.slackWebhookURL = options.slackWebhookURL;
    this.pipelineUrl = options.pipelineUrl;
  }

  printsToStdio() {
    return false;
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const isExpectedStatus = result.status === test.expectedStatus;
    const isLastAttempt = result.retry === test.retries;

    if (isExpectedStatus || isLastAttempt) {
      this.results.push({
        id: test.id,
        name: test.titlePath().slice(1).join(" > "),
        status: result.status,
      });
    }
  }

  async onEnd() {
    const payload = this.buildSlackPayload();
    await this.sendSlackWebhook(payload);
  }

  private buildSlackPayload() {
    const passed = this.results.filter(({ status }) => status === "passed");
    const skipped = this.results.filter(({ status }) => status === "skipped");
    const failed = this.results.filter(
      ({ status }) =>
        status === "failed" ||
        status === "interrupted" ||
        status === "timedOut",
    );

    const headerText = `E2E test report - passed ${passed.length} | failed ${failed.length} | skipped ${skipped.length}`;

    const blocks: Array<unknown> = [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: headerText,
        },
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Allure report: <${this.pipelineUrl}|open run artifacts>`,
          },
        ],
      },
    ];

    const baseUrl = process.env.BASE_URL;
    if (baseUrl) {
      const url = new URL(baseUrl);
      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `<${url.href}|${url.hostname}>`,
        },
      });
    }

    if (failed.length > 0) {
      blocks.push(...this.buildFailuresDetails(failed));
    }

    return { blocks };
  }

  private buildFailuresDetails(failures: Results) {
    const MAX_SLACK_CONTEXT_LENGTH = 9;

    const elements = failures
      .map(({ name }) => name)
      .sort()
      .slice(0, MAX_SLACK_CONTEXT_LENGTH)
      .map((test) => ({
        type: "mrkdwn",
        text: test,
      }));

    if (failures.length > MAX_SLACK_CONTEXT_LENGTH) {
      elements.push({
        type: "mrkdwn",
        text: `and ${failures.length - MAX_SLACK_CONTEXT_LENGTH} more`,
      });
    }

    return [
      { type: "divider" },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "_Failed tests_",
        },
      },
      {
        type: "context",
        elements,
      },
    ];
  }

  private async sendSlackWebhook(payload: unknown) {
    try {
      const response = await fetch(this.slackWebhookURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`Slack webhook failed with status ${response.status}`);
      }
    } catch (error) {
      throw new Error("Error while sending Slack report");
    }
  }
}

export default SlackReporter;
