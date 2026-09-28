import { execFileSync } from 'node:child_process';

// Long-lived Instagram tokens expire after 60 days unless refreshed, and can only be
// refreshed once they are at least 24 hours old. Run on a schedule well inside that window.
const token = process.env.INSTAGRAM_ACCESS_TOKEN;
const repository = process.env.GITHUB_REPOSITORY;

if (!token) throw new Error('INSTAGRAM_ACCESS_TOKEN is not set');
if (!process.env.GH_TOKEN) throw new Error('GH_TOKEN is not set (needs repository Secrets write access)');
if (!repository) throw new Error('GITHUB_REPOSITORY is not set');

const url = new URL('https://graph.instagram.com/refresh_access_token');
url.searchParams.set('grant_type', 'ig_refresh_token');
url.searchParams.set('access_token', token);

const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
if (!response.ok) throw new Error(`Instagram refresh_access_token returned ${response.status}`);
const { access_token: refreshed, expires_in: expiresIn } = await response.json();
if (!refreshed) throw new Error('Instagram returned no refreshed token');

execFileSync('gh', ['secret', 'set', 'INSTAGRAM_ACCESS_TOKEN', '--repo', repository], {
  input: refreshed,
  stdio: ['pipe', 'ignore', 'pipe'],
});

const days = expiresIn ? ` It expires in ${Math.round(expiresIn / 86400)} days.` : '';
console.log(`Instagram token refreshed and saved to GitHub Actions secrets.${days}`);
