import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import yaml from 'js-yaml';
import type { TeamConfig, NotifyConfig } from './types.js';

function getRepoRoot(): string {
  if (process.env['LEGIBLY_REPO_ROOT']) {
    return process.env['LEGIBLY_REPO_ROOT'];
  }
  try {
    return execSync('git rev-parse --show-toplevel', { encoding: 'utf8' }).trim();
  } catch {
    // Fallback: calculated relative to compiled dist/
    const __dirname = dirname(fileURLToPath(import.meta.url));
    return resolve(__dirname, '../../../');
  }
}

export const repoRoot = getRepoRoot();

export async function loadConfig(): Promise<TeamConfig> {
  const configPath = resolve(repoRoot, 'config/team-config.yml');
  const raw = readFileSync(configPath, 'utf8');
  const config = yaml.load(raw) as TeamConfig;

  if (!Array.isArray(config.deploy_points) || config.deploy_points.length === 0) {
    throw new Error('team-config.yml must have a deploy_points array');
  }

  for (const dp of config.deploy_points) {
    if (!dp.environment) throw new Error('Each deploy_point must have an environment');
    if (!dp.personas?.length) throw new Error(`deploy_point "${dp.environment}" must have at least one persona`);

    // Validate persona files exist at startup — fail fast with a clear message
    for (const persona of dp.personas) {
      const personaPath = resolve(repoRoot, 'personas', `${persona}.md`);
      if (!existsSync(personaPath)) {
        throw new Error(
          `Persona file not found: personas/${persona}.md\n` +
          `  Referenced in deploy_point "${dp.environment}"\n` +
          `  Create the file or remove "${persona}" from the personas list.`
        );
      }
    }
  }

  if (!config.ai_provider?.type) {
    throw new Error(
      'team-config.yml must have ai_provider.type\n' +
      '  Supported values: anthropic | github-copilot | openai | azure-openai'
    );
  }

  for (const dp of config.deploy_points) {
    if (dp.notify) {
      validateNotifyConfigs(dp.notify, dp.environment);
    }
  }

  if (config.team?.jira_project_key) {
    process.env['JIRA_PROJECT_KEY'] = config.team.jira_project_key;
  }

  return config;
}

function validateNotifyConfigs(
  notify: Record<string, NotifyConfig[]>,
  environment: string
): void {
  for (const [persona, configs] of Object.entries(notify)) {
    if (!Array.isArray(configs)) {
      console.warn(
        `Warning: notify["${persona}"] in deploy_point "${environment}" must be an array. Skipping.`
      );
      continue;
    }

    for (const cfg of configs) {
      if (!cfg || typeof cfg !== 'object' || !('type' in cfg)) {
        console.warn(
          `Warning: invalid notify config for persona "${persona}" in "${environment}". Each entry must have a "type" field.`
        );
        continue;
      }

      switch (cfg.type) {
        case 'slack':
          if (!cfg.webhook_url) {
            console.warn(
              `Warning: slack notify config for "${persona}" in "${environment}" is missing "webhook_url".`
            );
          }
          break;
        case 'teams':
          if (!cfg.webhook_url) {
            console.warn(
              `Warning: teams notify config for "${persona}" in "${environment}" is missing "webhook_url".`
            );
          }
          break;
        case 'confluence':
          if (!cfg.base_url || !cfg.page_id || !cfg.username_secret || !cfg.token_secret) {
            console.warn(
              `Warning: confluence notify config for "${persona}" in "${environment}" is missing required fields (base_url, page_id, username_secret, token_secret).`
            );
          }
          break;
        case 'webhook':
          if (!cfg.url) {
            console.warn(
              `Warning: webhook notify config for "${persona}" in "${environment}" is missing "url".`
            );
          }
          break;
        default: {
          const unknown = cfg as { type: string };
          console.warn(
            `Warning: unknown notify type "${unknown.type}" for persona "${persona}" in "${environment}". Supported: slack, teams, confluence, webhook.`
          );
        }
      }
    }
  }
}
