export interface MRMetadata {
  title: string;
  description: string;
  labels: string[];
  author: string;
}

export async function fetchMRMetadata(
  projectUrl: string,
  mrIid: string | undefined,
  projectId: string | undefined
): Promise<MRMetadata | null> {
  const token = process.env.GITLAB_API_TOKEN;
  if (!token || !mrIid || !projectId) return null;

  try {
    const url = new URL(projectUrl);
    const apiBase = `${url.protocol}//${url.host}/api/v4`;
    const res = await fetch(
      `${apiBase}/projects/${projectId}/merge_requests/${mrIid}`,
      { headers: { 'PRIVATE-TOKEN': token } }
    );
    if (!res.ok) return null;

    const mr = await res.json() as {
      title: string;
      description: string;
      labels: string[];
      author: { name: string };
    };

    return {
      title: mr.title,
      description: mr.description ?? '',
      labels: mr.labels ?? [],
      author: mr.author?.name ?? '',
    };
  } catch {
    return null;
  }
}
