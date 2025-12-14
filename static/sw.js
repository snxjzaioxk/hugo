// Service Worker for Aliom's Blog
// 版本号更新时会触发缓存刷新
const CACHE_VERSION = 'v2';
const CACHE_NAME = `aliom-blog-${CACHE_VERSION}`;
const OFFLINE_URL = '/offline.html';

// 预缓存的核心资源
const PRECACHE_URLS = [
  '/',
  '/offline.html',
  '/index.xml',
  '/logo.png',
  '/manifest.json'
];

// 缓存策略配置
const CACHE_STRATEGIES = {
  // 静态资源 - 缓存优先
  static: /\.(css|js|woff2?|ttf|eot|ico|svg)$/,
  // 图片 - 缓存优先，长期保存
  images: /\.(png|jpg|jpeg|gif|webp|avif)$/,
  // HTML 页面 - 网络优先
  pages: /\.html$|\/$/
};

// 安装事件 - 预缓存关键资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] 预缓存核心资源');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => self.skipWaiting())
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name.startsWith('aliom-blog-') && name !== CACHE_NAME)
          .map(name => {
            console.log('[SW] 删除旧缓存:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      console.log('[SW] 激活完成');
      return self.clients.claim();
    })
  );
});

// 缓存优先策略
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return null;
  }
}

// 网络优先策略（带超时）
async function networkFirst(request, timeout = 3000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(request, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    const cached = await caches.match(request);
    if (cached) return cached;

    // 页面请求返回离线页面
    if (request.mode === 'navigate') {
      return caches.match(OFFLINE_URL);
    }
    return null;
  }
}

// Stale-While-Revalidate 策略
async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);

  // 后台更新缓存
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      caches.open(CACHE_NAME).then(cache => {
        cache.put(request, response.clone());
      });
    }
    return response;
  }).catch(() => null);

  // 有缓存直接返回，同时后台更新
  return cached || fetchPromise;
}

// 请求拦截
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // 只处理 GET 请求
  if (request.method !== 'GET') return;

  // 跳过非同源和 API 请求
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;

  // 根据资源类型选择策略
  let responsePromise;

  if (CACHE_STRATEGIES.static.test(url.pathname)) {
    // 静态资源 - 缓存优先
    responsePromise = cacheFirst(request);
  } else if (CACHE_STRATEGIES.images.test(url.pathname)) {
    // 图片 - Stale-While-Revalidate
    responsePromise = staleWhileRevalidate(request);
  } else {
    // 页面和其他 - 网络优先
    responsePromise = networkFirst(request);
  }

  event.respondWith(
    responsePromise.then(response => response || fetch(request))
  );
});

// 接收消息 - 支持手动更新
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
