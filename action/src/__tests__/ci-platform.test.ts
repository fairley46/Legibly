import { describe, it, expect, beforeEach } from 'vitest';
import { detectPlatform, getPlatformEnv } from '../ci-platform.js';

const clean = () => {
  delete process.env.GITHUB_ACTIONS;
  delete process.env.GITLAB_CI;
  delete process.env.BITBUCKET_BUILD_NUMBER;
};

describe('detectPlatform', () => {
  beforeEach(clean);

  it('returns github when GITHUB_ACTIONS is true', () => {
    process.env.GITHUB_ACTIONS = 'true';
    expect(detectPlatform()).toBe('github');
  });

  it('returns gitlab when GITLAB_CI is true', () => {
    process.env.GITLAB_CI = 'true';
    expect(detectPlatform()).toBe('gitlab');
  });

  it('returns bitbucket when BITBUCKET_BUILD_NUMBER is set', () => {
    process.env.BITBUCKET_BUILD_NUMBER = '42';
    expect(detectPlatform()).toBe('bitbucket');
  });

  it('returns generic when none are set', () => {
    expect(detectPlatform()).toBe('generic');
  });
});

describe('getPlatformEnv — gitlab', () => {
  beforeEach(() => {
    clean();
    process.env.GITLAB_CI = 'true';
    process.env.CI_COMMIT_BRANCH = 'main';
    process.env.CI_COMMIT_SHA = 'abc123';
    process.env.CI_PROJECT_URL = 'https://gitlab.com/myorg/myrepo';
    process.env.CI_MERGE_REQUEST_IID = '7';
    process.env.CI_MERGE_REQUEST_TITLE = 'My MR';
  });

  it('maps GitLab vars to common shape', () => {
    const env = getPlatformEnv();
    expect(env.platform).toBe('gitlab');
    expect(env.branch).toBe('main');
    expect(env.sha).toBe('abc123');
    expect(env.prNumber).toBe('7');
    expect(env.prTitle).toBe('My MR');
  });
});

describe('getPlatformEnv — bitbucket', () => {
  beforeEach(() => {
    clean();
    process.env.BITBUCKET_BUILD_NUMBER = '99';
    process.env.BITBUCKET_BRANCH = 'main';
    process.env.BITBUCKET_COMMIT = 'def456';
    process.env.BITBUCKET_WORKSPACE = 'myorg';
    process.env.BITBUCKET_REPO_SLUG = 'myrepo';
    process.env.BITBUCKET_PR_ID = '12';
    process.env.BITBUCKET_PR_TITLE = 'My PR';
  });

  it('maps Bitbucket vars to common shape', () => {
    const env = getPlatformEnv();
    expect(env.platform).toBe('bitbucket');
    expect(env.branch).toBe('main');
    expect(env.sha).toBe('def456');
    expect(env.repoUrl).toBe('https://bitbucket.org/myorg/myrepo');
    expect(env.prNumber).toBe('12');
  });
});

describe('getPlatformEnv — generic', () => {
  beforeEach(() => {
    clean();
    process.env.BRANCH = 'main';
    process.env.SHA = 'ghi789';
    process.env.REPO_URL = 'https://example.com/myrepo';
  });

  it('reads standard env vars for generic CI', () => {
    const env = getPlatformEnv();
    expect(env.platform).toBe('generic');
    expect(env.branch).toBe('main');
    expect(env.sha).toBe('ghi789');
  });
});
