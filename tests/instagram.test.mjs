import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, chmod } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

test('preserves downloaded posts when Instagram fails later', async () => {
  const cwd = process.cwd();
  const originalEnv = { ...process.env };
  const originalFetch = globalThis.fetch;
  const tempDir = await mkdtemp(join(tmpdir(), 'scg-instagram-'));
  const script = `file://${resolve('scripts/sync-instagram.mjs')}`;

  try {
    process.chdir(tempDir);
    process.env.INSTAGRAM_ACCESS_TOKEN = 'old-token';
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

  } finally {
    process.chdir(cwd);
    process.env = originalEnv;
    globalThis.fetch = originalFetch;
  }
});

test('refreshes the token and saves it as a GitHub secret', async () => {
  const cwd = process.cwd();
  const originalEnv = { ...process.env };
  const originalFetch = globalThis.fetch;
  const tempDir = await mkdtemp(join(tmpdir(), 'scg-instagram-token-'));
  const script = `file://${resolve('scripts/refresh-instagram-token.mjs')}`;

  try {
    process.chdir(tempDir);
    await mkdir('bin');
    await writeFile('bin/gh', '#!/bin/sh\necho "$@" > "$FAKE_GH_OUTPUT.args"\ncat > "$FAKE_GH_OUTPUT"\n');
    await chmod('bin/gh', 0o755);
    process.env.PATH = `${join(tempDir, 'bin')}:${originalEnv.PATH}`;
    process.env.INSTAGRAM_ACCESS_TOKEN = 'old-token';
    process.env.GH_TOKEN = 'github-token';
    process.env.GITHUB_REPOSITORY = 'owner/repo';
    process.env.FAKE_GH_OUTPUT = join(tempDir, 'saved-token');
    globalThis.fetch = async (url) => {
      const request = new URL(url);
      assert.ok(request.pathname.endsWith('/refresh_access_token'));
      assert.equal(request.searchParams.get('access_token'), 'old-token');
      return Response.json({ access_token: 'new-token', expires_in: 5184000 });
    };
    await import(`${script}?refresh`);
    assert.equal(await readFile('saved-token', 'utf8'), 'new-token');
    assert.equal((await readFile('saved-token.args', 'utf8')).trim(), 'secret set INSTAGRAM_ACCESS_TOKEN --repo owner/repo');

    globalThis.fetch = async () => new Response('expired', { status: 400 });
    await assert.rejects(import(`${script}?expired`), /returned 400/);
  } finally {
    process.chdir(cwd);
    process.env = originalEnv;
    globalThis.fetch = originalFetch;
  }
});
