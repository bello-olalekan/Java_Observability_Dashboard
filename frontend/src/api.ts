import type { HealthStatus, Note } from './types';

const jsonHeaders = {
  'Content-Type': 'application/json'
};

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, options);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export async function getHealth(): Promise<HealthStatus> {
  return request<HealthStatus>('/actuator/health');
}

export async function getNotes(): Promise<Note[]> {
  return request<Note[]>('/api/notes');
}

export async function createNote(title: string, body: string): Promise<Note> {
  return request<Note>('/api/notes', {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ title, body })
  });
}

export async function putCacheValue(key: string, value: string, ttlSeconds = 300) {
  return request<{ key: string; value: string; ttlSeconds: number }>(`/api/cache/${encodeURIComponent(key)}`, {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify({ value, ttlSeconds })
  });
}
