export type CIPlatform = 'github' | 'gitlab' | 'bitbucket' | 'generic';

export interface PlatformEnv {
  platform: CIPlatform;
  branch: string;
  sha: string;
  repoUrl: string;
  prNumber?: string;
  prTitle?: string;
}

export function detectPlatform(): CIPlatform {
  if (process.env.GITHUB_ACTIONS === 'true') return 'github';
  if (process.env.GITLAB_CI === 'true') return 'gitlab';
  if (process.env.BITBUCKET_BUILD_NUMBER) return 'bitbucket';
  return 'generic';
}

export function getPlatformEnv(): PlatformEnv {
  const platform = detectPlatform();

  switch (platform) {
    case 'github': {
      const serverUrl = process.env.GITHUB_SERVER_URL ?? 'https://github.com';
      const repo = process.env.GITHUB_REPOSITORY ?? '';
      return {
        platform,
        branch: process.env.GITHUB_REF_NAME ?? '',
        sha: process.env.GITHUB_SHA ?? '',
        repoUrl: `${serverUrl}/${repo}`,
        prNumber: process.env.GITHUB_EVENT_NUMBER,
      };
    }

    case 'gitlab':
      return {
        platform,
        branch: process.env.CI_COMMIT_BRANCH
          ?? process.env.CI_MERGE_REQUEST_SOURCE_BRANCH_NAME
          ?? '',
        sha: process.env.CI_COMMIT_SHA ?? '',
        repoUrl: process.env.CI_PROJECT_URL ?? '',
        prNumber: process.env.CI_MERGE_REQUEST_IID,
        prTitle: process.env.CI_MERGE_REQUEST_TITLE,
      };

    case 'bitbucket': {
      const workspace = process.env.BITBUCKET_WORKSPACE ?? '';
      const slug = process.env.BITBUCKET_REPO_SLUG ?? '';
      return {
        platform,
        branch: process.env.BITBUCKET_BRANCH ?? '',
        sha: process.env.BITBUCKET_COMMIT ?? '',
        repoUrl: `https://bitbucket.org/${workspace}/${slug}`,
        prNumber: process.env.BITBUCKET_PR_ID,
        prTitle: process.env.BITBUCKET_PR_TITLE,
      };
    }

    default:
      return {
        platform: 'generic',
        branch: process.env.BRANCH ?? '',
        sha: process.env.SHA ?? '',
        repoUrl: process.env.REPO_URL ?? '',
      };
  }
}
