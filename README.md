# ShipSignal

> Engineering teams are shipping faster than ever. The communication layer hasn't kept up.

---

## Table of Contents

- [The Problem](#the-problem)
- [What ShipSignal Does](#what-shipsignal-does)
- [How It Works](#how-it-works)
- [Quick Start](#quick-start)
- [Setup Guide](#setup-guide)
- [Personas](#personas)
  - [Built-in Personas](#built-in-personas)
  - [Adding a Persona](#adding-a-persona)
  - [Editing a Persona](#editing-a-persona)
  - [Removing a Persona](#removing-a-persona)
- [Brand Voice](#brand-voice)
- [Output](#output)
- [Manual Runs](#manual-runs)
- [Forking for Your Team](#forking-for-your-team)
- [License](#license)

---

## The Problem

Agentic development has changed the game. Engineers are shipping at a pace that was impossible two years ago — features, fixes, and optimizations that used to take sprints now land in hours. Jira is still a place to track work, but an engineer can do the work of an entire sprint in a single session.

The problem is that none of that velocity shows up in the customer conversation.

Product owners are still manually reading through PRs, decoding commit messages, and translating technical changes into language that customers can understand and care about. That's not a product owner problem — it's a structural gap. The communication layer was built for a world where teams shipped every two weeks. It hasn't scaled to a world where teams ship continuously, at 10x the pace.

The result: engineering teams are creating enormous value, and almost none of it gets communicated. Customers don't know what changed. Stakeholders can't see the progress. The PO spends time writing changelogs instead of talking to customers.

**ShipSignal closes that gap.** It automates the translation from technical work to customer value — so the communication layer moves at the speed of code.

---

## What ShipSignal Does

On every merge or push, ShipSignal:

1. Reads the git diff, commit messages, and PR description
2. Pulls linked Jira ticket context via the Jira API
3. Uses AI to extract the value signal — metrics, improvements, fixes, new capabilities
4. Generates release notes tailored to each configured audience (persona)
5. Commits the notes back to your repo as markdown files

The product owner's job shifts from **writing** to **talking to customers**. The communication still happens — it just doesn't require a human to produce it.

---

## How It Works

```
merge / push to configured branch
        ↓
GitHub Action fires
        ↓
reads: git diff + commits + PR description + Jira tickets
        ↓
AI extracts value signals (metrics, changes, fixes, improvements)
        ↓
generates notes per persona (executive, end-user, partner, etc.)
        ↓
commits markdown files to release-notes/{environment}/
```

**Two configuration surfaces — that's it:**

- **`config/voice.md`** — your brand voice, writing rules, banned phrases. Owned by product.
- **`personas/*.md`** — one file per audience. Add, edit, or remove. No code changes needed.

Everything else is automatic.

---

## Quick Start

```bash
# 1. Fork this repo

# 2. Copy the sample config
cp examples/sample-team-config.yml config/team-config.yml

# 3. Edit config/team-config.yml
#    - Set your team name and Jira project key
#    - Set your ai_provider.type
#    - Configure your deploy_points and personas

# 4. Add your secrets to GitHub Actions (see Setup Guide)

# 5. Push to a configured branch and watch it run
```

---

## Setup Guide

### Step 1 — Configure your team

Copy the sample config and open it:

```bash
cp examples/sample-team-config.yml config/team-config.yml
```

Set your team name and Jira project key:

```yaml
team:
  name: "Platform Team"
  jira_project_key: "PLAT"
```

Configure your deploy points — which branches map to which environments, and which personas fire for each:

```yaml
deploy_points:
  - environment: production
    branch_pattern: "main"
    personas: [executive, end-user, partner]

  - environment: staging
    branch_pattern: "release/*"
    personas: [internal, technical-user]
```

---

### Step 2 — Choose your AI provider

Set `ai_provider.type` in `team-config.yml`:

| Provider | `type` value | Secret required |
|---|---|---|
| Anthropic | `anthropic` | `AI_API_KEY` |
| GitHub Copilot Enterprise | `github-copilot` | `GITHUB_TOKEN` with Copilot API access |
| OpenAI | `openai` | `AI_API_KEY` |
| Azure OpenAI | `azure-openai` | `AI_API_KEY` + `azure_endpoint` + `azure_deployment` |

```yaml
ai_provider:
  type: anthropic
  model: claude-sonnet-4-6
```

---

### Step 3 — Add secrets

Go to **Settings > Secrets and variables > Actions** in your repo and add:

| Secret | Description |
|---|---|
| `AI_API_KEY` | Your AI provider API key (not needed for GitHub Copilot Enterprise) |
| `JIRA_BASE_URL` | Your Jira instance URL, e.g. `https://yourorg.atlassian.net` |
| `JIRA_USER_EMAIL` | Email address associated with your Jira account |
| `JIRA_API_TOKEN` | Jira API token — generate at [id.atlassian.com](https://id.atlassian.com/manage-profile/security/api-tokens) |

**Secret management options:**

- **Repo-level** — Settings > Secrets and variables > Actions (default)
- **Org-level** — Org Settings > Secrets — set once, inherited by all repos. Best for org-wide rollouts.
- **Environments** — Scope secrets to specific environments (production vs staging) with optional approval gates
- **External** — HashiCorp Vault, AWS Secrets Manager, Azure Key Vault — for teams with existing secret management infrastructure

---

### Step 4 — Customize your voice

Open `config/voice.md` and update it to match your brand. This file defines:

- Core writing principles (lead with value, active voice, specificity)
- Banned phrases (no "leverages", no "seamless", no "game-changing")
- Formatting rules
- How to handle metrics, security fixes, and sensitive information

This file is owned by the product team. No engineering changes needed to update it.

---

## Personas

Personas are the core of ShipSignal. Each persona is a plain markdown file in the `personas/` folder that defines a specific audience — who they are, what they care about, how they want to be spoken to, and the exact structure of their release notes.

**No code changes are needed to manage personas.** Add a file, edit a file, delete a file.

### Built-in Personas

| Persona | Audience | Typical environments |
|---|---|---|
| `executive.md` | C-suite, VPs — business outcomes, risk, impact | Production |
| `end-user.md` | Day-to-day users — speed, reliability, ease of use | Production |
| `technical-user.md` | Engineers, admins — specifics, metrics, breaking changes | Staging, Production |
| `partner.md` | Integration partners — API changes, SDK impacts, deprecations | Production |
| `internal.md` | QA, product team — what to validate, what to watch for | Staging / UAT |

---

### Adding a Persona

1. Create a new file in `personas/`, e.g. `personas/enterprise-admin.md`

2. Follow this structure:

```markdown
# Persona: [Name]

## Audience Description
Who they are, what they care about, what context they operate in.

## Writing Instructions
- Specific rules for this audience
- What to include, what to skip
- How to handle metrics and technical terms

## Output Structure
The exact markdown template to follow for this audience.

## Tone
One paragraph describing the register and style.

## Good Example
> A sample of what great output looks like for this persona.

## Bad Example
> A sample of what to avoid.
```

3. Add the persona name to the relevant `deploy_points[].personas` list in `config/team-config.yml`:

```yaml
deploy_points:
  - environment: production
    personas: [executive, end-user, partner, enterprise-admin]  # added here
```

That's it. ShipSignal will include it on the next run.

---

### Editing a Persona

Open the file in `personas/` and update it directly. Changes take effect on the next pipeline run. Common edits:

- **Tone shifts** — update the Tone section and the Good/Bad examples
- **Structure changes** — update the Output Structure template
- **Scope changes** — add or remove items from Writing Instructions
- **Audience changes** — if a persona's audience definition evolves, update the Audience Description

The product team can own and evolve these files independently of the engineering team.

---

### Removing a Persona

1. Delete the file from `personas/`
2. Remove the persona name from `deploy_points[].personas` in `config/team-config.yml`

---

## Brand Voice

`config/voice.md` is the universal style guide applied to every persona on every run. Think of it as the floor — personas build on top of it.

It defines:

- **Core principles** — how to frame value, language level, specificity requirements
- **Banned phrases** — words and constructions that should never appear in output
- **Formatting rules** — headers, bullets, metric formatting, date formatting
- **Metric translation guide** — how to convert technical numbers into customer language
- **Sensitive information rules** — what to never expose (infra topology, vulnerability details, internal ticket IDs)

Update `config/voice.md` whenever your brand voice evolves, a new communications standard is adopted, or you find patterns in the output that need to be corrected across all personas at once.

---

## Output

Generated files land in:

```
release-notes/{environment}/{YYYY-MM-DD}-{sha8}-{persona}.md
```

Examples:
```
release-notes/production/2026-03-16-a3f7b2c1-executive.md
release-notes/production/2026-03-16-a3f7b2c1-end-user.md
release-notes/staging/2026-03-15-f4a921bc-internal.md
release-notes/hotfix/2026-03-14-8de3c12a-end-user.md
```

Each file includes YAML frontmatter for downstream tooling:

```yaml
---
release_date: 2026-03-16
environment: production
persona: end-user
commit: a3f7b2c1
branch: main
generated_by: ShipSignal
---
```

Followed by the release note content in the persona's defined structure.

If a push contains no user-visible changes (pure internal refactor, dependency updates with no impact), ShipSignal skips file generation for that run.

---

## Manual Runs

Trigger ShipSignal manually from the GitHub Actions UI under **Actions > Generate Release Notes > Run workflow**.

Optional inputs:

| Input | Description | Example |
|---|---|---|
| `environment` | Override the detected environment | `production` |
| `personas` | Comma-separated persona override | `executive,end-user` |

Useful for re-generating notes after updating a persona file, or for testing a new persona before it goes live.

---

## Forking for Your Team

1. Fork this repo
2. Set `ai_provider.type` in `config/team-config.yml` to match your stack
3. Update `config/voice.md` to reflect your brand voice
4. Update or add personas in `personas/` for your specific audiences
5. Add your secrets
6. Push — ShipSignal runs on the next merge

---

## License

MIT
