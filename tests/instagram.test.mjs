import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, chmod } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

test('refreshes the token and preserves downloaded posts when Instagram fails later', async () => {
  const cwd = process.cwd();
  const originalEnv = { ...process.env };
  const originalFetch = globalThis.fetch;
  const tempDir = await mkdtemp(join(tmpdir(), 'scg-instagram-'));
  const script = `file://${resolve('scripts/sync-instagram.mjs')}`;

  try {
    process.chdir(tempDir);
    process.env.INSTAGRAM_ACCESS_TOKEN = 'old-token';
    delete process.env.GH_TOKEN;
    globalThis.fetch = async (url) => {
      if (String(url).includes('/me/media')) {
        return Response.json({ data: [{ id: '123', caption: 'Team lunch', media_url: 'https://example.com/image.jpg', permalink: 'https://instagram.com/p/123/' }] });
      }
      return new Response('image bytes', { headers: { 'content-type': 'image/jpeg' } });
    };
    await import(`${script}?first`);
    const first = JSON.parse(await readFile('.cache/instagram/posts.json', 'utf8'));
    assert.equal(first.posts[0].caption, 'Team lunch');
    assert.equal(await readFile('public/assets/instagram/123.jpg', 'utf8'), 'image bytes');

    globalThis.fetch = async () => { throw new Error('Instagram unavailable'); };
    await import(`${script}?second`);
    const fallback = JSON.parse(await readFile('.cache/instagram/posts.json', 'utf8'));
    assert.deepEqual(fallback.posts, first.posts);
    assert.equal(await readFile('public/assets/instagram/123.jpg', 'utf8'), 'image bytes');

    await mkdir('bin');
    await writeFile('bin/gh', '#!/bin/sh\ncat > "$FAKE_GH_OUTPUT"\n');
    await chmod('bin/gh', 0o755);
    process.env.PATH = `${join(tempDir, 'bin')}:${originalEnv.PATH}`;
    process.env.GH_TOKEN = 'github-token';
    process.env.GITHUB_REPOSITORY = 'owner/repo';
    process.env.FAKE_GH_OUTPUT = join(tempDir, 'saved-token');
    globalThis.fetch = async (url) => {
      const request = new URL(url);
      if (request.pathname.includes('refresh_access_token')) return Response.json({ access_token: 'new-token', expires_in: 5184000 });
      if (request.pathname.includes('/me/media')) {
        assert.equal(request.searchParams.get('access_token'), 'new-token');
        return Response.json({ data: [{ id: '124', caption: 'Another day', media_url: 'https://example.com/second.jpg', permalink: 'https://instagram.com/p/124/' }] });
      }
      return new Response('new image', { headers: { 'content-type': 'image/jpeg' } });
    };
    await import(`${script}?third`);
    assert.equal(await readFile('saved-token', 'utf8'), 'new-token');
    const refreshed = JSON.parse(await readFile('.cache/instagram/posts.json', 'utf8'));
    assert.ok(refreshed.refreshedAt);
    assert.equal(refreshed.posts[0].id, '124');
  } finally {
    process.chdir(cwd);
    process.env = originalEnv;
    globalThis.fetch = originalFetch;
  }
});
