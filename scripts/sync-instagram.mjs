import { execFileSync } from 'node:child_process';
import { mkdir, readFile, rename, writeFile, copyFile } from 'node:fs/promises';
import { join } from 'node:path';

const cacheDir = '.cache/instagram';
const imageDir = join(cacheDir, 'images');
const publicImageDir = 'public/assets/instagram';
const cacheFile = join(cacheDir, 'posts.json');
const token = process.env.INSTAGRAM_ACCESS_TOKEN;

async function readCache() {
  try { return JSON.parse(await readFile(cacheFile, 'utf8')); }
  catch { return { posts: [], refreshedAt: null }; }
}

async function saveCache(cache) {
  await mkdir(cacheDir, { recursive: true });
  await writeFile(`${cacheFile}.tmp`, JSON.stringify(cache, null, 2));
  await rename(`${cacheFile}.tmp`, cacheFile);
}

async function instagramGet(path, params, accessToken) {
  const url = new URL(`https://graph.instagram.com/${path}`);
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value);
  url.searchParams.set('access_token', accessToken);
  const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error(`Instagram ${path} returned ${response.status}`);
  return response.json();
}

let cache = await readCache();
let activeToken = token;

// Refresh monthly. GitHub secrets need a separate token with repository Secrets write access.
if (token && process.env.GH_TOKEN && process.env.GITHUB_REPOSITORY &&
    (!cache.refreshedAt || Date.now() - Date.parse(cache.refreshedAt) > 30 * 86400_000)) {
  try {
    const refreshed = await instagramGet('refresh_access_token', { grant_type: 'ig_refresh_token' }, token);
    if (!refreshed.access_token) throw new Error('Instagram returned no refreshed token');
    execFileSync('gh', ['secret', 'set', 'INSTAGRAM_ACCESS_TOKEN', '--repo', process.env.GITHUB_REPOSITORY], {
      input: refreshed.access_token,
      stdio: ['pipe', 'ignore', 'pipe'],
    });
    activeToken = refreshed.access_token;
    cache.refreshedAt = new Date().toISOString();
    await saveCache(cache);
    console.log('Instagram token refreshed and saved to GitHub Actions secrets.');
  } catch (error) {
    console.warn(`Instagram token refresh skipped: ${error.message}`);
  }
}

if (activeToken) {
  try {
    const { data } = await instagramGet('me/media', {
      fields: 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp',
      limit: '8',
    }, activeToken);
    const media = (data ?? []).filter((post) =>
      /^[a-zA-Z0-9_-]+$/.test(String(post.id)) && post.permalink &&
      (post.thumbnail_url || (post.media_type !== 'VIDEO' && post.media_url))
    ).slice(0, 6);
    if (media.length === 0) throw new Error('Instagram returned no image posts');

    await mkdir(imageDir, { recursive: true });
    const posts = [];
    for (const post of media) {
      const imageResponse = await fetch(post.thumbnail_url || post.media_url, { signal: AbortSignal.timeout(8000) });
      if (!imageResponse.ok) throw new Error(`Post image returned ${imageResponse.status}`);
      const contentType = imageResponse.headers.get('content-type') || '';
      if (!contentType.startsWith('image/')) throw new Error('Instagram returned a non-image');
      const extension = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
      const imageFile = `${post.id}.${extension}`;
      await writeFile(join(imageDir, imageFile), Buffer.from(await imageResponse.arrayBuffer()));
      posts.push({ id: post.id, imageFile, caption: post.caption || '', permalink: post.permalink });
    }
    cache = { ...cache, posts };
    await saveCache(cache);
    console.log(`Cached ${posts.length} Instagram posts.`);
  } catch (error) {
    console.warn(`Using cached Instagram posts: ${error.message}`);
  }
}

await mkdir(publicImageDir, { recursive: true });
for (const post of cache.posts) {
  try { await copyFile(join(imageDir, post.imageFile), join(publicImageDir, post.imageFile)); }
  catch { console.warn(`Cached Instagram image missing for post ${post.id}.`); }
}
