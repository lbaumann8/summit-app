/* 
  Summit PWA service worker
  - Cache-first for same-origin static assets only
  - Network-first for navigations with index.html fallback
  - No aggressive caching for auth/API/payment routes
  - Versioned cache names so deployments can invalidate safely
*/

const APP_SHELL_CACHE = 'summit-app-shell-v1';
const STATIC_ASSET_CACHE = 'summit-static-v1';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg'
];

// Same-origin paths we never want to cache aggressively.
const EXCLUDED_PATH_PREFIXES = [
  '/auth',
  '/api',
  '/supabase',
  '/functions',
  '/payments',
  '/payment',
  '/checkout',
  '/stripe'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(APP_SHELL_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();

      await Promise.all(
        keys
          .filter(
            (key) => key !== APP_SHELL_CACHE && key !== STATIC_ASSET_CACHE
          )
          .map((key) => caches.delete(key))
      );

      if ('navigationPreload' in self.registration) {
        await self.registration.navigationPreload.enable();
      }

      await self.clients.claim();
    })()
  );
});

function isExcludedRequest(request, url) {
  if (request.method !== 'GET') return true;
  if (url.origin !== self.location.origin) return true;

  const pathname = url.pathname;

  if (EXCLUDED_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return true;
  }

  // Extra guardrails for auth/session/token style URLs
  if (
    pathname.includes('/session') ||
    pathname.includes('/token') ||
    pathname.includes('/callback')
  ) {
    return true;
  }

  return false;
}

function isStaticAsset(url) {
  return (
    url.pathname.startsWith('/assets/') ||
    /\.(?:js|mjs|css|ico|png|jpg|jpeg|gif|svg|webp|woff2?|ttf|eot)$/i.test(
      url.pathname
    )
  );
}

function shouldCacheStaticResponse(request, response, url) {
  if (!response || !response.ok) return false;

  // Only cache normal same-origin responses
  if (response.type !== 'basic') return false;
  if (url.origin !== self.location.origin) return false;

  // Avoid caching query-string based asset requests
  if (url.search) return false;

  // Only cache GET requests
  if (request.method !== 'GET') return false;

  return true;
}

async function cacheFirst(request) {
  const url = new URL(request.url);
  const cache = await caches.open(STATIC_ASSET_CACHE);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  const response = await fetch(request);

  if (shouldCacheStaticResponse(request, response, url)) {
    cache.put(request, response.clone());
  }

  return response;
}

async function networkFirstNavigation(event) {
  const request = event.request;
  const appShellCache = await caches.open(APP_SHELL_CACHE);

  try {
    const preloadResponse = await event.preloadResponse;
    if (preloadResponse) {
      if (
        preloadResponse.ok &&
        preloadResponse.type === 'basic' &&
        preloadResponse.headers.get('content-type')?.includes('text/html')
      ) {
        appShellCache.put('/index.html', preloadResponse.clone());
      }
      return preloadResponse;
    }

    const networkResponse = await fetch(request);

    if (
      networkResponse.ok &&
      networkResponse.type === 'basic' &&
      networkResponse.headers.get('content-type')?.includes('text/html')
    ) {
      appShellCache.put('/index.html', networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    const cachedRoute = await caches.match(request);
    if (cachedRoute) return cachedRoute;

    const cachedShell = await appShellCache.match('/index.html');
    if (cachedShell) return cachedShell;

    throw error;
  }
}

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (isExcludedRequest(event.request, url)) {
    return;
  }

  // SPA navigations: prefer fresh HTML, fall back to cached shell.
  if (event.request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(event));
    return;
  }

  // Static build assets: cache-first for faster repeat loads.
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(event.request));
  }
});