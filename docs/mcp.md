# MCP Skill

The MCP skill exposes Legibly's translation pipeline conversationally, inside any MCP-compatible client. Same prompt assembly, same AI providers, same personas and voice as the GitHub Action — but on demand, before a merge, mid-review, or during standup prep.

**Two delivery modes, one translation brain.**

| | GitHub Action | MCP Skill |
|---|---|---|
| When it runs | Automatically on every merge | On demand, whenever you ask |
| Input | Live git diff + CI env vars | PR URL, pasted description, optional diff |
| Output | Markdown files committed to repo | Text returned in the conversation |
| Writes files | Yes | Never |

---

## Requirements

- Node.js 20+
- Any MCP-compatible client (Claude Desktop, opencode, Cursor, Zed, Windsurf, etc.)
- Legibly repo cloned locally and configured (`config/team-config.yml` set up)
- An AI provider key (`AI_API_KEY`) — same key your GitHub Action uses

---

## Setup

### 1. Build

```bash
cd action
npm install
npm run build
```

Confirm `dist/mcp.js` exists:

```bash
ls action/dist/mcp.js
```

### 2. Register as an MCP server

The server command is always the same regardless of client:

```
node /absolute/path/to/repo/action/dist/mcp.js
```

Required env vars:

| Variable | Notes |
|---|---|
| `LEGIBLY_REPO_ROOT` | Absolute path to the repo root. Missing = startup crash. |
| `AI_API_KEY` | Your AI provider key (Anthropic, OpenAI, Azure). Not needed for GitHub Copilot provider. |

Optional env vars:

| Variable | Notes |
|---|---|
| `GITHUB_TOKEN` | Needed for `pr_url` input (fetches PR body from GitHub API). |
| `JIRA_BASE_URL` / `JIRA_USER_EMAIL` / `JIRA_API_TOKEN` | Same as the Action. No-ops gracefully if absent. |

---

### Client-specific config

#### Claude Desktop

`~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "legibly": {
      "command": "node",
      "args": ["/absolute/path/to/repo/action/dist/mcp.js"],
      "env": {
        "LEGIBLY_REPO_ROOT": "/absolute/path/to/repo",
        "AI_API_KEY": "sk-ant-...",
        "GITHUB_TOKEN": "ghp_..."
      }
    }
  }
}
```

Restart Claude Desktop after editing. The tools will appear automatically.

#### opencode

```toml
# ~/.config/opencode/config.toml  (or opencode.json — check your version)
[mcp.legibly]
command = "node"
args = ["/absolute/path/to/repo/action/dist/mcp.js"]

[mcp.legibly.env]
LEGIBLY_REPO_ROOT = "/absolute/path/to/repo"
AI_API_KEY = "sk-ant-..."
GITHUB_TOKEN = "ghp_..."
```

#### Cursor

In Cursor settings, add under **MCP Servers**:

```json
{
  "legibly": {
    "command": "node",
    "args": ["/absolute/path/to/repo/action/dist/mcp.js"],
    "env": {
      "LEGIBLY_REPO_ROOT": "/absolute/path/to/repo",
      "AI_API_KEY": "sk-ant-..."
    }
  }
}
```

#### Any other client

If your client supports stdio MCP servers, the config shape is the same pattern: command `node`, args pointing to `dist/mcp.js`, env with `LEGIBLY_REPO_ROOT` and `AI_API_KEY`. Check your client's docs for where to put it.

### 3. Verify

Ask your client: **"What personas does Legibly know about?"**

You should get a list of all personas from your `config/team-config.yml`.

---

## Available Tools

### `list-personas`

Lists every persona configured in `team-config.yml`, the environments each appears in, and a one-line description from the persona file.

**When to use:** before translating, to check what persona names are available.

**Example prompt:**
> What personas does Legibly know about?

**Example output:**
```
**Legibly Personas**

**vp**
  Environments: production, hotfix
  C-suite and VP-level stakeholders. Business outcomes, risk, and customer impact only.

**customer**
  Environments: production, hotfix
  Day-to-day users of the product. Non-technical. They care about whether things work.

**partner**
  Environments: production
  Integration partners and API consumers who have built on top of this platform.
```

---

### `translate`

Translates a PR into release notes for a specific persona. Uses your configured AI provider, voice, and prompt — the same pipeline the GitHub Action uses.

**Inputs:**

| Field | Required | Notes |
|---|---|---|
| `persona` | Yes | Name from `list-personas` |
| `pr_url` | One of these | GitHub PR URL — fetches the body via API. Needs `GITHUB_TOKEN`. |
| `pr_description` | One of these | Paste the PR body directly. No token needed. |
| `environment` | No (default: `production`) | `production`, `staging`, `hotfix`, `canary` |
| `diff` | No | Output of `git diff HEAD~1 HEAD --stat --unified=0` |
| `commit_messages` | No | Output of `git log --oneline -20` |
| `sha` | No | Commit SHA for frontmatter metadata |
| `branch` | No | Branch name for frontmatter metadata |

At least one of `pr_url` or `pr_description` is required.

---

## Usage Patterns

### Quickest path — paste a PR description

Open a PR on GitHub, copy the description, then ask:

> Translate this for the customer persona:
>
> [paste PR description]

### With a PR URL

If `GITHUB_TOKEN` is set:

> Translate https://github.com/your-org/your-repo/pull/456 for the vp persona.

Legibly fetches the PR body automatically.

### With extra context (richer output)

More context → sharper notes. Run these before asking:

```bash
git diff HEAD~1 HEAD --stat --unified=0
git log --oneline -20
```

Then paste alongside your request:

> Translate this PR for the technical-user persona.
>
> **PR description:** [paste]
> **Diff:** [paste]
> **Commits:** [paste]

### Staging or hotfix framing

> Translate this for the internal persona using staging environment framing.

The `environment` field changes how the AI frames changes — staging emphasizes what to validate, hotfix leads with what was broken and what's resolved.

### Compare personas side by side

> Translate this PR for the vp persona and then for the customer persona.

Two separate `translate` calls, both results returned.

---

## Troubleshooting

**"Legibly MCP: failed to load config"** — `LEGIBLY_REPO_ROOT` is missing or doesn't point to a directory with `config/team-config.yml`. Verify the path is absolute and correct.

**"Error: persona 'X' not found"** — Persona name doesn't match any file in `personas/`. The error lists available options. Use `list-personas` first.

**"Error generating release notes: 401"** — `AI_API_KEY` is missing or invalid.

**PR URL fetch returns "Pull request description unavailable"** — `GITHUB_TOKEN` is not set or lacks `repo` read access. Add it or paste the description directly.

**Tools don't appear in your client** — Verify the path in `args` is absolute, `dist/mcp.js` exists, and you've restarted the client after config changes.

**Output looks vague** — Same cause as the Action: vague PR descriptions produce vague notes. Give it more specific input. See [Engineering Process](setup.md#engineering-process).

---

## Rebuilding After Changes

Personas, voice, config — no rebuild needed. Those files are read at call time.

Action source code (`.ts` files) — rebuild:

```bash
cd action && npm run build
```

Then restart your MCP client to pick up the new `dist/mcp.js`.
