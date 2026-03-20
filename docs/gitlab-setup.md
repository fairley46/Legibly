# GitLab CI Setup Guide

## Prerequisites

- A GitLab project (cloud or self-hosted)
- Node.js 20 or later available in your GitLab runners
- An AI provider key (Anthropic Claude, OpenAI, or GitHub Copilot)

## Required CI/CD Variables

Set these variables in your GitLab project settings under **CI/CD > Variables**.

| Variable | Required | Description |
|----------|----------|-------------|
| `AI_API_KEY` | Yes | Anthropic / OpenAI / Copilot API key |
| `CI_ACCESS_TOKEN` | Yes | Project access token with `write_repository` scope (Settings > Access Tokens) |
| `GITLAB_API_TOKEN` | No | Personal/project token for MR description enrichment |
| `JIRA_BASE_URL` | No | Your Jira instance URL |
| `JIRA_TOKEN` | No | Jira API token |

## Creating a Project Access Token

1. Go to your GitLab project
2. Navigate to **Settings > Access Tokens**
3. Click **Add new token**
4. Give it a name (e.g., "Legibly CI")
5. Select expiry (optional but recommended)
6. Check **write_repository** scope
7. Click **Create project access token**
8. Copy the token and add it to CI/CD variables as `CI_ACCESS_TOKEN`

## Branch Triggers

Legibly automatically runs on pushes to these branches:

- `main`
- `release/*` (e.g., `release/1.0.0`)
- `hotfix/*` (e.g., `hotfix/critical-bug`)

The branch name determines the deployment environment:
- `main` → `production`
- `release/*` → `staging`
- `hotfix/*` → `hotfix`

You can customize these patterns by editing `.gitlab-ci.yml`.

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

4. **Add secrets to your GitLab CI/CD variables:**
   - `AI_API_KEY`: Your AI provider key
   - `CI_ACCESS_TOKEN`: Your project access token (see above)
   - Optional: `GITLAB_API_TOKEN`, `JIRA_BASE_URL`, `JIRA_TOKEN`

5. **Push to a configured branch:**
   Create a commit on `main` (or another configured branch) with a clear PR description and commit message. Push it up. The workflow will run automatically.

6. **Check the results:**
   Look for a new commit in your repository with generated release notes in `release-notes/{environment}/`. Review them, then trigger the notification stage if you want to send them to Slack, Teams, etc.

## How to Trigger the Notify Stage Manually

After Legibly has generated and committed the release notes:

1. Go to your GitLab project
2. Navigate to **CI/CD > Pipelines**
3. Find the pipeline that generated the notes
4. Scroll to the **notify** stage (appears after automatic generation completes)
5. Click the play button (▶) next to a notify job
6. The notification will be sent to your configured channels (Slack, Teams, Confluence, etc.)

Alternatively, manually trigger the full pipeline with a custom variable:

```bash
git push -o ci.variable="FORCE_NOTIFY=true"
```

## Key Differences from GitHub Actions Setup

| Aspect | GitHub Actions | GitLab CI |
|--------|---|---|
| **Trigger mechanism** | `on: push: branches:` | `only: - branches:` pattern or rules |
| **Secrets management** | Repository secrets | Project CI/CD variables (Settings > CI/CD) |
| **Branch context** | `${{ github.ref }}` | `$CI_COMMIT_REF_NAME` |
| **Commit SHA** | `${{ github.sha }}` | `$CI_COMMIT_SHA` |
| **PR/MR enrichment** | GitHub API token optional | `GITLAB_API_TOKEN` optional for MR descriptions |
| **Artifact retention** | Configurable in workflow | Defined in `.gitlab-ci.yml` or project settings |
| **Manual triggers** | Actions > Workflow > Run workflow button | Pipelines > Click play on stage |
| **Notification config** | `.github/workflows/notify.yml` | Notify jobs in `.gitlab-ci.yml` |

For detailed setup instructions, see [docs/setup.md](setup.md). For customization, see [docs/customization.md](customization.md).
