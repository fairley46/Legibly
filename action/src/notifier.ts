import type {
  GeneratedNote,
  NotifyConfig,
  SlackNotifyConfig,
  TeamsNotifyConfig,
  ConfluenceNotifyConfig,
  WebhookNotifyConfig,
} from './types.js';

function resolveEnvVar(value: string): string {
  if (value.startsWith('$')) {
    const key = value.slice(1);
    return process.env[key] ?? '';
  }
  return value;
}

function markdownToConfluenceStorage(markdown: string): string {
  const blocks = markdown.split(/\n\n+/);
  return blocks
    .map(block => {
      if (block.startsWith('### ')) return `<h3>${block.slice(4).trim()}</h3>`;
      if (block.startsWith('## ')) return `<h2>${block.slice(3).trim()}</h2>`;
      if (block.startsWith('# ')) return `<h1>${block.slice(2).trim()}</h1>`;
      const lines = block.split('\n');
      if (lines.every(l => l === '' || l.startsWith('- '))) {
        const items = lines
          .filter(l => l.startsWith('- '))
          .map(l => `<li>${l.slice(2)}</li>`)
          .join('');
        return `<ul>${items}</ul>`;
      }
      const html = block
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br/>');
      return `<p>${html}</p>`;
    })
    .join('\n');
}

async function sendSlack(note: GeneratedNote, config: SlackNotifyConfig): Promise<void> {
  const webhookUrl = resolveEnvVar(config.webhook_url);
  if (!webhookUrl) throw new Error('Slack webhook_url resolved to empty string');

  const payload = {
    text: `*${note.personaName}* release notes for *${note.deployEnv}*`,
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: `${note.personaName} — ${note.deployEnv}` },
      },
      {
        type: 'section',
        text: { type: 'mrkdwn', text: note.content.slice(0, 3000) },
      },
    ],
  };

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`Slack returned ${res.status}: ${await res.text()}`);
}

async function sendTeams(note: GeneratedNote, config: TeamsNotifyConfig): Promise<void> {
  const webhookUrl = resolveEnvVar(config.webhook_url);
  if (!webhookUrl) throw new Error('Teams webhook_url resolved to empty string');

  const payload = {
    '@type': 'MessageCard',
    '@context': 'http://schema.org/extensions',
    themeColor: '0076D7',
    summary: `${note.personaName} release notes — ${note.deployEnv}`,
    sections: [
      {
        activityTitle: `${note.personaName} — ${note.deployEnv}`,
        activityText: note.content.slice(0, 4000),
      },
    ],
  };

  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`Teams returned ${res.status}: ${await res.text()}`);
}

async function sendConfluence(note: GeneratedNote, config: ConfluenceNotifyConfig): Promise<void> {
  const username = process.env[config.username_secret];
  const token = process.env[config.token_secret];
  if (!username || !token) {
    throw new Error(
      `Confluence credentials not found. Set env vars: ${config.username_secret}, ${config.token_secret}`
    );
  }

  const auth = Buffer.from(`${username}:${token}`).toString('base64');
  const baseUrl = config.base_url.replace(/\/$/, '');
  const pageUrl = `${baseUrl}/rest/api/content/${config.page_id}?expand=body.storage,version`;

  const getRes = await fetch(pageUrl, {
    headers: { Authorization: `Basic ${auth}`, Accept: 'application/json' },
  });
  if (!getRes.ok) throw new Error(`Confluence GET ${config.page_id} failed: ${getRes.status}`);

  const page = (await getRes.json()) as {
    title: string;
    version: { number: number };
    body: { storage: { value: string } };
  };

  const date = new Date().toISOString().split('T')[0];
  const newEntry = markdownToConfluenceStorage(note.content);
  const newBody =
    `<h2>${note.personaName} — ${date}</h2>\n${newEntry}\n<hr/>\n` +
    page.body.storage.value;

  const putRes = await fetch(`${baseUrl}/rest/api/content/${config.page_id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      version: { number: page.version.number + 1 },
      title: page.title,
      type: 'page',
      body: { storage: { value: newBody, representation: 'storage' } },
    }),
  });

  if (!putRes.ok) {
    throw new Error(`Confluence PUT ${config.page_id} failed: ${putRes.status}: ${await putRes.text()}`);
  }
}

async function sendWebhook(note: GeneratedNote, config: WebhookNotifyConfig): Promise<void> {
  const url = resolveEnvVar(config.url);
  if (!url) throw new Error('Webhook url resolved to empty string');

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (config.headers) {
    for (const [key, value] of Object.entries(config.headers)) {
      headers[key] = resolveEnvVar(value);
    }
  }

  const payload = {
    persona: note.personaName,
    environment: note.deployEnv,
    release_date: new Date().toISOString().split('T')[0],
    commit: (process.env['GH_SHA'] ?? 'unknown').slice(0, 8),
    branch: process.env['GH_REF_NAME'] ?? 'unknown',
    content: note.content,
    generated_by: 'ShipSignal',
  };

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`Webhook returned ${res.status}: ${await res.text()}`);
}

export async function sendNotifications(
  note: GeneratedNote,
  configs: NotifyConfig[]
): Promise<void> {
  const results = await Promise.allSettled(
    configs.map(cfg => {
      switch (cfg.type) {
        case 'slack':
          return sendSlack(note, cfg);
        case 'teams':
          return sendTeams(note, cfg);
        case 'confluence':
          return sendConfluence(note, cfg);
        case 'webhook':
          return sendWebhook(note, cfg);
        default: {
          const exhaustive: never = cfg;
          return Promise.reject(
            new Error(`Unknown notify type: ${(exhaustive as { type: string }).type}`)
          );
        }
      }
    })
  );

  for (let i = 0; i < results.length; i++) {
    const result = results[i]!;
    const cfg = configs[i]!;
    if (result.status === 'fulfilled') {
      console.log(`  [ok] ${cfg.type}`);
    } else {
      const msg = result.reason instanceof Error ? result.reason.message : String(result.reason);
      console.warn(`  [warn] ${cfg.type} failed: ${msg}`);
    }
  }
}
