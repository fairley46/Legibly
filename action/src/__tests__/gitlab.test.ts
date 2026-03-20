import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchMRMetadata } from '../gitlab.js';

const mockFetch = vi.fn();
global.fetch = mockFetch as unknown as typeof fetch;

describe('fetchMRMetadata', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.GITLAB_API_TOKEN;
  });

  it('returns null when GITLAB_API_TOKEN is not set', async () => {
    const result = await fetchMRMetadata('https://gitlab.com/org/repo', '5', '123');
    expect(result).toBeNull();
  });

  it('returns null when mrIid is undefined', async () => {
    process.env.GITLAB_API_TOKEN = 'token';
    const result = await fetchMRMetadata('https://gitlab.com/org/repo', undefined, '123');
    expect(result).toBeNull();
  });

  it('returns MR data on success', async () => {
    process.env.GITLAB_API_TOKEN = 'token';
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        title: 'Add feature',
        description: 'This adds the feature',
        labels: ['feature'],
        author: { name: 'Alice' },
      }),
    });
    const result = await fetchMRMetadata('https://gitlab.com/org/repo', '5', '123');
    expect(result?.title).toBe('Add feature');
    expect(result?.author).toBe('Alice');
  });

  it('returns null on API error without throwing', async () => {
    process.env.GITLAB_API_TOKEN = 'token';
    mockFetch.mockResolvedValueOnce({ ok: false });
    const result = await fetchMRMetadata('https://gitlab.com/org/repo', '5', '123');
    expect(result).toBeNull();
  });
});
