/* eslint-disable-next-line unicorn/prefer-node-protocol */
import fs from 'fs';
import * as core from '@actions/core';
import axios, { isAxiosError } from 'axios';
import {
  fetchLatestMatchingTag,
  fetchLatestReleaseTag,
} from './services/githubService';
import { getNewReleaseTag } from './services/releaseService';
import { extractTagPrefix } from './utils';

/* eslint-disable n/prefer-global/process, prettier/prettier, unicorn/escape-case, @typescript-eslint/prefer-nullish-coalescing, unicorn/no-process-exit, @stylistic/padding-line-between-statements */
async function validateSubscription() {
  const eventPath = process.env.GITHUB_EVENT_PATH
  let repoPrivate: boolean | undefined

  if (eventPath && fs.existsSync(eventPath)) {
    const eventData = JSON.parse(fs.readFileSync(eventPath, 'utf8'))
    repoPrivate = eventData?.repository?.private
  }

  const upstream = 'amitsingh-007/next-release-tag';
  const action = process.env.GITHUB_ACTION_REPOSITORY;
  const docsUrl = 'https://docs.stepsecurity.io/actions/stepsecurity-maintained-actions';

  core.info('');
  core.info('\u001b[1;36mStepSecurity Maintained Action\u001b[0m');
  core.info(`Secure drop-in replacement for ${upstream}`);
  if (repoPrivate === false) core.info('\u001b[32m\u2713 Free for public repositories\u001b[0m');
  core.info(`\u001b[36mLearn more:\u001b[0m ${docsUrl}`);
  core.info('');

  if (repoPrivate === false) return;

  const serverUrl = process.env.GITHUB_SERVER_URL || 'https://github.com';
  const body: Record<string, string> = { action: action || '' };
  if (serverUrl !== 'https://github.com') body.ghes_server = serverUrl;
  try {
    await axios.post(
      `https://agent.api.stepsecurity.io/v1/github/${process.env.GITHUB_REPOSITORY}/actions/maintained-actions-subscription`,
      body, { timeout: 3000 }
    );
  } catch (error_) {
    if (isAxiosError(error_) && error_.response?.status === 403) {
      core.error(`\u001b[1;31mThis action requires a StepSecurity subscription for private repositories.\u001b[0m`);
      core.error(`\u001b[31mLearn how to enable a subscription: ${docsUrl}\u001b[0m`);
      process.exit(1);
    }
    core.info('Timeout or API not reachable. Continuing to next step.');
  }
}
/* eslint-enable n/prefer-global/process, prettier/prettier, unicorn/escape-case, @typescript-eslint/prefer-nullish-coalescing, unicorn/no-process-exit, @stylistic/padding-line-between-statements */

const resolvePreviousTag = async (tagPrefix: string) => {
  const previousTagOverride = core.getInput('previous_tag');

  // If a previous tag is provided, use it
  if (previousTagOverride) {
    return previousTagOverride;
  }

  // If its a prefix wildcard then fetch the latest matching tag
  if (tagPrefix.endsWith('*')) {
    return fetchLatestMatchingTag(extractTagPrefix(tagPrefix));
  }

  // If its a normal tag then fetch the latest release tag
  return fetchLatestReleaseTag();
};

const generateNextReleaseTag = async (): Promise<void> => {
  try {
    const tagPrefix = core.getInput('tag_prefix');
    const tagTemplate = core.getInput('tag_template');
    const previousTagOverride = await resolvePreviousTag(tagPrefix);

    const newReleaseTag = getNewReleaseTag(
      extractTagPrefix(tagPrefix),
      tagTemplate,
      previousTagOverride
    );

    console.log(`Previous Release Tag: ${previousTagOverride}`);
    console.log(`New Release Tag: ${newReleaseTag}`);

    core.setOutput('prev_release_tag', previousTagOverride);
    core.setOutput('next_release_tag', newReleaseTag);
  } catch (error_) {
    if (error_ instanceof Error) {
      core.setFailed(error_.message);
    } else {
      core.error(JSON.stringify(error_));
    }
  }
};

const run = async (): Promise<void> => {
  await validateSubscription();
  await generateNextReleaseTag();
};

void run();
