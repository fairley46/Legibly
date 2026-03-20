# Using Legibly with Any CI System

Legibly's core action is a Node.js script. If your CI system isn't GitHub Actions, GitLab CI, or Bitbucket Pipelines, you can still use Legibly by calling it directly.

## How it works

Run `node action/dist/index.js` in your pipeline with these environment variables set:

| Variable | Required | Description |
|----------|----------|-------------|
| `AI_API_KEY` | Yes | Anthropic / OpenAI / Copilot API key |
| `BRANCH` | Yes | Current branch name (e.g. `main`) |
| `SHA` | Yes | Full commit SHA |
| `REPO_URL` | No | Repository URL -- used for context only |
| `DEPLOY_ENVIRONMENT` | No | `production`, `staging`, or `hotfix` -- auto-detected from branch if not set |

## Example: Azure DevOps

```yaml
- task: NodeTool@0
  inputs:
    versionSpec: '20.x'

- script: |
    cd action && npm ci && npm run build
    export BRANCH=$(Build.SourceBranchName)
    export SHA=$(Build.SourceVersion)
    export REPO_URL=$(Build.Repository.Uri)
    node dist/index.js
  env:
    AI_API_KEY: $(AI_API_KEY)
```

## Example: CircleCI

```yaml
- run:
    name: Generate release notes
    command: |
      cd action && npm ci && npm run build
      export BRANCH=$CIRCLE_BRANCH
      export SHA=$CIRCLE_SHA1
      node dist/index.js
    environment:
      AI_API_KEY: << pipeline.parameters.ai_api_key >>
```

## Notes

- PR/MR description enrichment is not available in generic mode -- Legibly uses commit messages only
- Committing generated notes back to the repo requires your CI system's credentials configured for git push
- All other features (personas, brand voice, Jira integration) work identically
