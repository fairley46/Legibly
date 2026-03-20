# Bitbucket Pipelines Setup Guide

## Prerequisites

- A Bitbucket Cloud repository
- Node.js 20 or later available in your Bitbucket build environment
- An AI provider key (Anthropic Claude, OpenAI, or GitHub Copilot)

## Required Repository Variables

Set these variables in your Bitbucket repository under **Repository settings > Pipelines > Repository variables**.

| Variable | Required | Description |
|----------|----------|-------------|
| `AI_API_KEY` | Yes | Anthropic / OpenAI / Copilot API key |
| `BB_ACCESS_TOKEN` | Yes | Repository access token with write scope (Repository settings > Access tokens) |
| `BITBUCKET_ACCESS_TOKEN` | No | For PR description enrichment |
| `JIRA_BASE_URL` | No | Your Jira instance URL |
| `JIRA_TOKEN` | No | Jira API token |

## How to Add Repository Variables

1. Go to your Bitbucket repository
2. Click **Repository settings** (left sidebar)
3. Scroll down to **Pipelines > Repository variables**
4. Click **Add variable**
5. Enter the variable name (e.g., `AI_API_KEY`)
6. Paste the value
7. Check **Secured** to hide the value in logs (recommended for API keys and tokens)
8. Click **Add**

## Creating a Repository Access Token

1. Go to your Bitbucket repository
2. Click **Repository settings** (left sidebar)
3. Scroll to **Security > Access tokens**
4. Click **Create repository access token**
5. Give it a name (e.g., "Legibly CI")
6. Under **Permissions**, check **Write** on **Repositories**
7. Click **Create**
8. Copy the token and add it to your repository variables as `BB_ACCESS_TOKEN`

## Branch Triggers

Legibly automatically runs on pushes to these branches:

- `main`
- `release/*` (e.g., `release/1.0.0`)
- `hotfix/*` (e.g., `hotfix/critical-bug`)

The branch name determines the deployment environment:
- `main` → `production`
- `release/*` → `staging`
- `hotfix/*` → `hotfix`

You can customize these patterns by editing `bitbucket-pipelines.yml`.

## First Run Walkthrough

1. **Configure your team setup:**
   ```bash
   cp examples/sample-team-config.yml config/team-config.yml
   ```
   Edit `config/team-config.yml` to match your team name, AI provider, and deployment points.

2. **Set up your brand voice:**
   Choose a pre-built voice from the `voices/` directory and copy it to `config/voice.md`:
   ```bash
   cp voices/the-operator.md config/voice.md
   ```
   Or create a custom voice by following [docs/customization.md](customization.md).

3. **Configure personas:**
   The `personas/` directory contains built-in audience definitions. Edit or add personas as needed.

4. **Add secrets to your Bitbucket repository variables:**
   - `AI_API_KEY`: Your AI provider key
   - `BB_ACCESS_TOKEN`: Your repository access token (see above)
   - Optional: `BITBUCKET_ACCESS_TOKEN`, `JIRA_BASE_URL`, `JIRA_TOKEN`

5. **Push to a configured branch:**
   Create a commit on `main` (or another configured branch) with a clear PR description and commit message. Push it up. The pipeline will run automatically.

6. **Check the results:**
   Look for a new commit in your repository with generated release notes in `release-notes/{environment}/`. Review them, then trigger the notification step if you want to send them to Slack, Teams, etc.

## Manual Notify Trigger

After Legibly has generated and committed the release notes:

1. Go to your Bitbucket repository
2. Navigate to **Pipelines** (in the left sidebar)
3. Find the pipeline that generated the notes (look for the main branch or feature branch)
4. Click the pipeline to view its jobs
5. Look for the **notify** job (appears as a separate step after the automatic generation)
6. Depending on your Bitbucket configuration:
   - If the notify step is paused/waiting, click **Run** to trigger it
   - If it ran automatically but you want to run it again, click the pipeline and look for a **Retry** option

Alternatively, you can trigger a fresh pipeline run with environment-specific variables by re-running the pipeline from Bitbucket's UI.

## Key Differences from GitHub Actions Setup

| Aspect | GitHub Actions | Bitbucket Pipelines |
|--------|---|---|
| **Config file** | `.github/workflows/` | `bitbucket-pipelines.yml` |
| **Trigger mechanism** | `on: push: branches:` | `branches: - pattern:` |
| **Secrets management** | Repository secrets | Repository variables (Repository settings > Pipelines) |
| **Branch context** | `${{ github.ref }}` | `$BITBUCKET_BRANCH` |
| **Commit SHA** | `${{ github.sha }}` | `$BITBUCKET_COMMIT` |
| **PR/MR enrichment** | GitHub API token optional | `BITBUCKET_ACCESS_TOKEN` optional for PR descriptions |
| **Manual triggers** | Actions > Workflow > Run workflow button | Pipelines > Click on pipeline > Run/Retry |
| **Notification config** | `.github/workflows/notify.yml` | Notify step in `bitbucket-pipelines.yml` |
| **Workspace** | Ubuntu latest | Docker image (customizable) |

For detailed setup instructions, see [docs/setup.md](setup.md). For customization, see [docs/customization.md](customization.md).
