import { readFileSync } from 'node:fs';

// The sync script caches public post data and local images before Astro builds.
export function getInstagramPosts() {
  try {
    return JSON.parse(readFileSync('.cache/instagram/posts.json', 'utf8')).posts;
  } catch {
    return [];
  }
}
