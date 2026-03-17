import { readdirSync, readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { loadConfig, repoRoot } from './config-loader.js';
import { sendNotifications } from './notifier.js';
import type { GeneratedNote, NotifyConfig } from './types.js';

async function run(): Promise<void> {
  const config = await loadConfig();

  const deployEnv = process.env['NOTIFY_ENVIRONMENT'];
  const personaInput = process.env['NOTIFY_PERSONA'] ?? '*';

  if (!deployEnv) throw new Error('NOTIFY_ENVIRONMENT env var is required');

  const deployPoint = config.deploy_points.find(dp => dp.environment === deployEnv);
  if (!deployPoint) {
    console.log(`No deploy point configured for environment: ${deployEnv}. Nothing to notify.`);
    process.exit(0);
  }

  if (!deployPoint.notify || Object.keys(deployPoint.notify).length === 0) {
    console.log(`No notify config for environment: ${deployEnv}. Nothing to send.`);
    process.exit(0);
  }

  const activePersonas =
    personaInput === '*' ? deployPoint.personas : [personaInput];

  const notesDir = resolve(repoRoot, 'release-notes', deployEnv);
  if (!existsSync(notesDir)) {
    console.log(`No release notes directory found: release-notes/${deployEnv}/`);
    process.exit(0);
  }

  const files = readdirSync(notesDir)
    .filter(f => f.endsWith('.md'))
    .sort()
    .reverse(); // newest first

  if (files.length === 0) {
    console.log(`No release notes found in release-notes/${deployEnv}/`);
    process.exit(0);
  }

  let anyNotified = false;

  for (const personaName of activePersonas) {
    const noteFile = files.find(f => f.endsWith(`-${personaName}.md`));
    if (!noteFile) {
      console.warn(`Warning: no note file found for persona "${personaName}" in release-notes/${deployEnv}/`);
      continue;
    }

    const content = readFileSync(resolve(notesDir, noteFile), 'utf8');
    const note: GeneratedNote = { personaName, content, deployEnv };

    const personaConfigs: NotifyConfig[] = deployPoint.notify[personaName] ?? [];
    const wildcardConfigs: NotifyConfig[] = deployPoint.notify['*'] ?? [];
    const allConfigs = [...personaConfigs, ...wildcardConfigs];

    if (allConfigs.length === 0) {
      console.log(`No notify configs for persona "${personaName}" (no named or wildcard hooks). Skipping.`);
      continue;
    }

    console.log(`\nNotifying for persona: ${personaName} (${allConfigs.length} channel(s))`);
    await sendNotifications(note, allConfigs);
    anyNotified = true;
  }

  if (!anyNotified) {
    console.log('No notifications sent.');
  } else {
    console.log('\nDone.');
  }
}

run().catch(err => {
  console.error('Notify failed:', err instanceof Error ? err.message : err);
  process.exit(1);
});
